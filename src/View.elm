module View exposing (..)

import Html exposing (..)
import Html.Events as Events
import Html.Attributes as Attr
import Svg exposing (svg)
import Model exposing (Model, Msg(..))


view : Model -> Html Msg
view model =
    div [ Attr.id "body" ]
        [ div [Attr.id "menu-bar"] 

            [ div   [ Attr.class "title"
                    , Attr.style "width" "70px"]
                    [ Html.text "FuseDM"]
            
            , select    [ Events.onInput SelectFile
                        , Attr.class "btn"]
                        <| List.map (\s-> option [Attr.value s] [text s]) 
                        <| model.fileList
            ]

        , button [ Attr.id "execute-button"
                ,  Attr.class "bx-btn"][]

        , button [ Attr.id "back-button"
                ,  Attr.class "bx-btn"][]

        , div [Attr.id "output-div"]
            [ svg [Attr.id "output-svg"] []]
        ]