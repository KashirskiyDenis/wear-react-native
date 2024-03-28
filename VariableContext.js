import { createContext, useContext, useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { DatabaseContext } from './DatabaseContext';
import clothesType from './resources/ClothesType';

const VariableContext = createContext(null);

function VariableProvider({ children }) {
  let { clothes, outfits } = useContext(DatabaseContext);

  let [mapImageClothes, setMapImageClothes] = useState(new Map());
  let [mapImageOutfits, setMapImageOutfits] = useState(new Map());

  let clothesTypeList = clothesType.split('\n');

  let getImage = async (pathToFile) => {
    let data = null;
    try {
      data = await FileSystem.readAsStringAsync(pathToFile, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (error) {
      console.log('Error to load file: ' + error.message);
    }
    return data;
  };

  let createMapImageClothes = async () => {
    if (clothes.length > 0) {
      for (let i = 0; i < clothes.length; i++) {
        mapImageClothes.set(
          clothes[i].id,
          await getImage(clothes[i].pathToFile)
        );
      }
    }
  };

  let createMapImageOutfits = async () => {
    if (outfits.length > 0) {
      for (let i = 0; i < outfits.length; i++) {
        mapImageOutfits.set(
          outfits[i].id,
          await getImage(outfits[i].pathToFile)
        );
      }
    }
  };

  let mapImageClothesPOST = (id, base64) => {
    let array = Array.from(mapImageClothes);
    let newMap = new Map(array);
    newMap.set(id, base64);
    setMapImageClothes(newMap);
  };

  let mapImageOutfitsPOST = (id, base64) => {
    let array = Array.from(mapImageOutfits);
    let newMap = new Map(array);
    newMap.set(id, base64);
    setMapImageOutfits(newMap);
  };

  useEffect(() => {
    createMapImageClothes();
    createMapImageOutfits();
  }, []);

  return (
    <VariableContext.Provider
      value={{
        mapImageClothes,
        mapImageClothesPOST,
        mapImageOutfits,
        mapImageOutfitsPOST,

        clothesTypeList,
      }}>
      {children}
    </VariableContext.Provider>
  );
}

export { VariableContext, VariableProvider };
