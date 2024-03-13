import { defineConfig } from 'vite';

export default defineConfig({
  // index.html の場所
  root: './',
  // アセットなどのパスを変換するベースとなるパス
  // `/foo/` とすると `/foo/` 始まりのパスに変換される
  base: '/d62/dist/',
  // 静的ファイルの場所
  //  `public` を指定した場合 `<root>/public` が静的ファイルの格納場所になる
  publicDir: 'dist',
});
