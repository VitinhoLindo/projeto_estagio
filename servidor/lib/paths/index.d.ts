interface Paths {
  dir: String;
  public: String;
  html: String;
  css: String;
  js: String;
  mail: String;
  lang: String;
}

'win32' | 'linux' | 'android';

declare function paths(plataform: 'win32'): Paths;
declare function paths(plataform: 'linux'): Paths;
declare function paths(plataform: 'android'): Paths;

export = paths;