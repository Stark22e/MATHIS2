/**
 * Created by vigon on 08/02/2017.
 */




module mathis{

    export module documentation {


        export class PureJavascriptTuto implements OnePage {
            
            pageIdAndTitle="hello world in pure javascript"
            severalParts:SeveralParts=null
            
            go():any{

                indexPage.enlarger.leftToFullPageTemporarily()


                /**obligé d'agir sur le parent car l'iframe sinon n'a pas de hauteur*/
                $('#pageContent').height('100%').empty()
                let $res=$('<div class="aWholeDiv" style="margin: auto"></div>')
                $res.append('<a target="_blank" href="https://drive.google.com/open?id=0B5ZYbxojmGIaMVFvdkZSVVFDY3M">Codes for this tuto and for the next one</a>')
                let $iframe=$('<iframe src="https://docs.google.com/document/d/1tqyLj66D4xKTPKeXS81GCZJwV_WHKH9PNywTrozmfM0/pub?embedded=true" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>')
                $res.append($iframe)
                
                return $res
            }
        }


        export class TypescriptTuto implements OnePage {

            pageIdAndTitle="hello typescript"
            severalParts:SeveralParts=null

            go():any{

                indexPage.enlarger.leftToFullPageTemporarily()

                /**obligé d'agir sur le parent car l'iframe sinon n'a pas de hauteur*/
                $('#pageContent').height('100%').empty()

                let $res=$('<div class="aWholeDiv"></div>')

                $res.append('<a target="_blank" href="https://drive.google.com/open?id=0B5ZYbxojmGIaMVFvdkZSVVFDY3M">Codes for this tuto and for the next one</a>')
                let $iframe=$('<iframe src="https://docs.google.com/document/d/1p6Ch4wyT9qVzLzdRSVumNRRB6CcpfrtNcJ_wbRku_94/pub?embedded=true" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>')
                $res.append($iframe)

                return $res
            }

        }


        export class ColaborateWithGit implements OnePage {

            pageIdAndTitle="Collaborate via github"
            severalParts:SeveralParts=null

            go():any{

                indexPage.enlarger.leftToFullPageTemporarily()


                /**obligé d'agir sur le parent car l'iframe sinon n'a pas de hauteur*/
                $('#pageContent').height('100%').empty()

                let $res=$('<div class="aWholeDiv"></div>')

                //$res.append('<a target="_blank" href="https://drive.google.com/open?id=0B5ZYbxojmGIaMVFvdkZSVVFDY3M">Codes for this tuto and for the next one</a>')
                let $iframe=$('<iframe src="https://docs.google.com/document/d/1TQnS7Xw1LbnqhtgphO020ljo3dA43Gg-wch42v0spAs/pub?embedded=true"  style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>')
                $res.append($iframe)

                return $res
            }

        }




        export class DocutestTuto implements OnePage {

            pageIdAndTitle="PieceOfCode and tests"
            severalParts:SeveralParts=null

            go():any{

                indexPage.enlarger.leftToFullPageTemporarily()


                /**obligé d'agir sur le parent car l'iframe sinon n'a pas de hauteur*/
                $('#pageContent').height('100%').empty()

                let $res=$('<div class="aWholeDiv"></div>')

                //$res.append('<a target="_blank" href="https://drive.google.com/open?id=0B5ZYbxojmGIaMVFvdkZSVVFDY3M">Codes for this tuto and for the next one</a>')
                let $iframe=$('<iframe src="https://docs.google.com/document/d/1ASn11sa2vpkabUXnbVOSnXe7DhIN_die0DZLn3ny9I0/pub?embedded=true"  style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>')
                $res.append($iframe)

                return $res
            }

        }

        export class DocutestTutoAdvanced implements OnePage {

            pageIdAndTitle="PieceOfCode and tests (advanced)"
            severalParts:SeveralParts=null

            go():any{

                indexPage.enlarger.leftToFullPageTemporarily()


                /**obligé d'agir sur le parent car l'iframe sinon n'a pas de hauteur*/
                $('#pageContent').height('100%').empty()

                let $res=$('<div class="aWholeDiv"></div>')

                //$res.append('<a target="_blank" href="https://drive.google.com/open?id=0B5ZYbxojmGIaMVFvdkZSVVFDY3M">Codes for this tuto and for the next one</a>')
                let $iframe=$('<iframe src="https://docs.google.com/document/d/1fC0cMkL9y1TclKGaz6hHjpW24ieR245oWTGVQETyyw8/pub?embedded=true"  style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>')
                $res.append($iframe)

                return $res
            }

        }







        //<iframe src="https://docs.google.com/document/d/1TQnS7Xw1LbnqhtgphO020ljo3dA43Gg-wch42v0spAs/pub?embedded=true"></iframe>
        
        
        
        
        
            
        }
        
    }