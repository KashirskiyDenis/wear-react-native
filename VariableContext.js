import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { DatabaseContext } from './DatabaseContext';
import thingType from './resources/ThingType';

const VariableContext = createContext(null);
const THING_TYPE_LIST = thingType.split('\n');

function VariableProvider({ children }) {
  let { clothes, outfits } = useContext(DatabaseContext);

  let [mapImageClothes, setMapImageClothes] = useState(new Map());
  let [mapImageOutfits, setMapImageOutfits] = useState(new Map());

  let getImage = useCallback(async (pathToFile) => {
    try {
      let data = await FileSystem.readAsStringAsync(pathToFile, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return data;
    } catch (error) {
      console.log('Error to load file: ' + error.message);
      return null;
    }
  }, []);

  let createMapImageClothes = useCallback(async () => {
    if (clothes.length === 0) return;

    let newMap = new Map();
    
    for (let i = 0; i < clothes.length; i++) {
      let cloth = clothes[i];
      let uri = await getImage(cloth.pathToFile);
      
      newMap.set(cloth.id, {
        uri,
        width: cloth.width,
        height: cloth.height,
      });
    }
    
    setMapImageClothes(newMap);
  }, [clothes, getImage]);

  let createMapImageOutfits = useCallback(async () => {
    if (outfits.length === 0) return;

    let newMap = new Map();
    
    for (let i = 0; i < outfits.length; i++) {
      let outfit = outfits[i];
      let uri = await getImage(outfit.pathToFile);
      
      newMap.set(outfit.id, uri);
    }
    
    setMapImageOutfits(newMap);
  }, [outfits, getImage]);

  let mapImageClothesPOST = useCallback((id, data) => {
    setMapImageClothes(prevMap => new Map(prevMap).set(id, data));
  }, []);

  let mapImageOutfitsPOST = useCallback((id, base64) => {
    setMapImageOutfits(prevMap => new Map(prevMap).set(id, base64));
  }, []);

  useEffect(() => {
    createMapImageClothes();
  }, [createMapImageClothes]);

  useEffect(() => {
    createMapImageOutfits();
  }, [createMapImageOutfits]);

  let contextValue = useMemo(
    () => ({
      mapImageClothes,
      mapImageClothesPOST,
      mapImageOutfits,
      mapImageOutfitsPOST,
      thingTypeList : THING_TYPE_LIST,
    }),
    [mapImageClothes, mapImageClothesPOST, mapImageOutfits, mapImageOutfitsPOST]
  );

  return (
    <VariableContext.Provider value={contextValue}>
      {children}
    </VariableContext.Provider>
  );
}

export { VariableContext, VariableProvider };
