export async function onRequestGet(context: EventContext) {
  const { request } = context;
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: "URLパラメータが必要です" }), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("text/html")) {
      return new Response(
        JSON.stringify({ error: "HTMLコンテンツではありません" }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    }

    // OGP情報を格納するオブジェクト
    const ogp = {
      title: "",
      description: "",
      image: "",
    };

    // HTMLRewriterを使ってmeta要素からOGP情報を抽出
    return new HTMLRewriter()
      .on("meta[property^='og:']", {
        element(element) {
          const property = element.getAttribute("property");
          const content = element.getAttribute("content");

          if (!property || !content) return;

          const key = property.replace("og:", "");
          if (key in ogp) {
            ogp[key] = content;
          }
        },
      })
      .on("title", {
        element(element) {
          // og:titleが存在しない場合にtitleタグの内容を使用
          if (ogp.title === "") {
            element.onEndTag = () => {
              if (!ogp.title && element.innerHTML) {
                ogp.title = element.innerHTML;
              }
            };
          }
        },
      })
      .on("meta[name='description']", {
        element(element) {
          // og:descriptionが存在しない場合にmeta descriptionを使用
          if (ogp.description === "") {
            const content = element.getAttribute("content");
            if (content) {
              ogp.description = content;
            }
          }
        },
      })
      .transform(response)
      .then(() => {
        return new Response(JSON.stringify(ogp, null, 2), {
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "URLの取得中にエラーが発生しました",
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  }
}
