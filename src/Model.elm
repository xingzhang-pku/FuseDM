module Model exposing(..)

import Language.Syntax exposing (Exp(..))

type alias Model =
    { exp      : Exp
    , fileList : List String
    }


type Msg
    = Execute String
    | Change String
    | SelectFile String


initModel : Model
initModel = 
    { exp      = EError "No code yet"
    , fileList = [ "New File", "PrecisionFloorPlan", "MondrianArch"
                , "BalanceScale", "BoxVolume", "Battery", "Ladder", "Logo"
                , "NBoxes", "FerrisWheel", "TreeBranch", "Target"
                , "PencilTip", "Arrows", "Rails", "SVG-1", "SVG-2"
                , "SVG-3", "SVG-4", "SVG-5", "SVG-6"
                , "Test-1", "Test-2", "Test-3", "Test-4"]
    }