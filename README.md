## Prerequisite

1. VS Code
2. Cocos Creator Dashboard and Cocos Creator 3.7.1
3. Install Prettie and Better comments extensions in vs code
4. Node JS

## To setup boiler plate

1. cmd `npm i` to install dependencies
2. Open project in Cocos Creator : MenuBar < developer < Visual Studio code workflow < Add chrome debug setting also Add compile task
3. run npm start
4. Open project in vs code and press F5 to run it in browser

## Naming and Folder structure which should be followed

1. Folder, Scene and Prefab name should be in camel casing Eg : resources , scene , gameManager , gameplay , frameColor
2. Class Name should be in PascalCase Eg : Lobby , GameManager , Gameplay
3. Asset name should be as the project is following camelcase , pascal or snake case as you like but follow the same structure for whole project

## Before building the project

## Comman classes

    * Base Class :{
        Path : Script < Comman < Base.ts
        Usage : Is should be extended from script attached to canvas of every scene with would contain function which need to triggered automatcially on scene change to release cache of or unsubscibe Message events
    }

    * Persist :{
        Path : Script < Comman < PersistNode
        Usage : It contains function to handle loaded and things we can handle in a persist node ( Persist Node is when we need something in comman in multiple scene)
    }

## Managers

    * DataManager :{
        Path : Script < managers < Datamanager
        Usage : This class will manage overall data you need to store during the session Eg : API response , Gameprogress and usedata
    }
    * GameManager :{
        Path : Script < managers < Gamemanger
        Usage : Gamemanger for overall game control
    }

    * Local and Session Storage Manager :{
        Path : script < manager < LocAndSessStoreManager
        Usage : To manage the local storage and session storage of overall game
    }

## Comments pattern after using better comments for sample

//\* (Something important)
// TODO: (Need to work on iut)
//! dont delete this code (warning to not delete this code)
//? Shouldn't be there only ( while raising PR if senior developer does not find code relevant)

## Steps to Implement Dat-GUI

-   Download dat.gui.min.js file from https://github.com/dataarts/dat.gui
-   Add it into your assets folder alongside your script for dat-gui
-   Add <import GUI from "./dat.gui.min.js"> in your script.
-   Further for implementation tutorial ,see DatGUI.ts
-   Details about more functions of Dat-GUI : https://github.com/dataarts/dat.gui/blob/HEAD/API.md#GUI+addFolder
