let clothes = `CREATE TABLE IF NOT EXISTS clothes (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	pathToFile TEXT NOT NULL,
  title TEXT NOT NULL,
	category TEXT NOT NULL,
	season TEXT NOT NULL,
	color TEXT NOT NULL
);`;

let outfits = `CREATE TABLE outfits (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
  pathToFile TEXT NOT NULL,
	season TEXT NOT NULL,
	event TEXT NOT NULL
);`;

let outfitClothes = `CREATE TABLE IF NOT EXISTS outfitClothes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
	idOutfit INTEGER NOT NULL,
	idClothes INTEGER NOT NULL,
	x INTEGER NOT NULL,
	y INTEGER NOT NULL,
	width INTEGER NOT NULL,
  height INTEGER NOT NULL,
	transform TEXT NOT NULL,
	FOREIGN KEY (idOutfit) REFERENCES outfit(id),
	FOREIGN KEY (idClothes) REFERENCES clothes(id)
)`;

export { clothes, outfits, outfitClothes, };