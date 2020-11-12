module.exports = function (plataform) {
  let plataforms = { win32: "windows", linux: "linux", android: "linux" };

  if (!(plataform in plataforms)) throw `plataform '${plataform}' is not supported`;

  plataform = plataforms[plataform];

  return require(`./${plataform}`);
};