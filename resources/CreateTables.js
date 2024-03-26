let clothes = `CREATE TABLE IF NOT EXISTS clothes (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	pathToFile TEXT NOT NULL,
  type TEXT NOT NULL,
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

let clothesInOutfit = `CREATE TABLE IF NOT EXISTS clothesInOutfit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
	idOutfit INTEGER NOT NULL,
	idClothes INTEGER NOT NULL,
	x INTEGER NOT NULL,
	y INTEGER NOT NULL,
	width INTEGER NOT NULL,
  height INTEGER NOT NULL,
	transform TEXT NOT NULL,
	FOREIGN KEY (idOutfit) REFERENCES outfits(id),
	FOREIGN KEY (idClothes) REFERENCES clothes(id)
)`;

export { clothes, outfits, clothesInOutfit, };