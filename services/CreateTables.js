let clothes = `CREATE TABLE IF NOT EXISTS clothes(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	pathToFile TEXT NOT NULL,
	category TEXT NOT NULL,
	season TEXT NOT NULL,
	color TEXT NOT NULL
);`;

let outfit = `CREATE TABLE outfit(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	season TEXT NOT NULL,
	event TEXT NOT NULL
);`;

let outfit_clothes = `CREATE TABLE outfit_clothes(
	idOutfit INTEGER NOT NULL,
	idClothes INTEGER NOT NULL,
	positionClothesX INTEGER NOT NULL,
	positionClothesY INTEGER NOT NULL,
	widthClothes INTEGER NOT NULL,
	heightClothes INTEGER NOT NULL,
	FOREIGN KEY (idOutfit) REFERENCES outfit(id),
	FOREIGN KEY (idClothes) REFERENCES clothes(id)
);`;

export { clothes, outfit, outfit_clothes, };