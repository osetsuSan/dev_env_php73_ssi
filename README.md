# 開発環境用コード一式（dev_env_php73_ssi）
PHP：7.3.27
MySQL：5.7.33

## ファイル構造
<pre>
│  .babelrc
│  .gitignore
│  docker-compose.yml
│  gulpfile.js
│  package-lock.json
│  package.json
│  
├─apache // Apache,PHP,Dockerビルド時設定
│  │  DockerFile
│  │  php.ini
│  │  
│  └─conf
│      │  apache2.conf
│      │  
│      └─000-default.conf
├─htdocs // DocumentRoot,コンパイル先ファイル
│  │  inc.html
│  │  index.html
│  │  
│  └─assets
│      ├─css
│      │      style.css
│      │      
│      └─js
│              script.js
└─resource // コンパイル元ファイル
    ├─es
    │      script.es // 通常のjsとは異なるためes拡張子で利用
    │      
    ├─pug
    │      inc.pug
    │      index.pug
    │      
    └─sass
            style.scss
</pre>


## 展開方法
1. Dockerコンテナを追加
```
docker-compose up -d
```
2. gulpで利用するモジュールをインストール
```
npm i
```
3. gulpが起動するか確認
```
npm start
```

## コンパイルについて
以下のフォルダ内のデータがコンパイル対象となります。
```
/resource～
```
pugフォルダはhtmlに変換し/htdocs以下に出力

sassフォルダはcssに変換し/htdocs/assets/css以下に出力

esフォルダはjsに変換し/htdocs/assets/js以下に出力
