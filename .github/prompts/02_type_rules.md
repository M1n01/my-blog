## 型定義の方針

- 可能な限り具体的な型を使用し、any は避ける
- 共有の型パターンには Utility Types を使用する
- 型エイリアスには意味のある名前をつけ、型の目的を明確にする

```ts
// 良い例
type UserId = string;
type UserData = {
  id: UserId;
  createdAt: Date;
};

// 避けるべき例
type Data = any;
```
