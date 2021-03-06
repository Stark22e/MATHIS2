/**
 * Created by vigon on 24/03/2016.
 */


module mathis{


    export module reseau{

        export enum Maille{square,triangle,diamond,hexagonal,slash,croisillon}

        
        export class SingleTriangle {
            makeLinks = true
            markCorners=true
            addALoopLineAround=false


            mamesh:Mamesh
            constructor(mamesh:Mamesh){this.mamesh=mamesh}


            go():void {

                let vert0=this.mamesh.newVertex(new XYZ(0,0,0))


                let vert1=this.mamesh.newVertex(new XYZ(0,1,0))

                let vert2=this.mamesh.newVertex(new XYZ(1,0,0))


                //let triangulatedRect=new Polygone([vert1,vert2,vert3])
                //mesh.polygones.push(triangulatedRect)

                this.mamesh.addATriangle(vert0,vert1,vert2)


                if (this.markCorners) {
                    vert0.markers.push(Vertex.Markers.corner)
                    vert1.markers.push(Vertex.Markers.corner)
                    vert2.markers.push(Vertex.Markers.corner)
                }

                if (this.makeLinks) {
                    if (!this.addALoopLineAround) {
                        vert0.setOneLink(vert1)
                        vert0.setOneLink(vert2)
                        vert1.setOneLink(vert0)
                        vert1.setOneLink(vert2)
                        vert2.setOneLink(vert0)
                        vert2.setOneLink(vert1)
                    }
                    else{
                        vert0.setTwoOppositeLinks(vert1,vert2)
                        vert1.setTwoOppositeLinks(vert2,vert0)
                        vert2.setTwoOppositeLinks(vert0,vert1)
                    }

                    //this.mamesh.linksOK = true
                }
                //else this.mamesh.linksOK=false

            }
        }


        export class TriangulatedTriangle{


            private mamesh:Mamesh

            markCorner=true
            markBorder=true
            origin=new XYZ(-1,-1,0)
            end=new XYZ(1,1,0)

            nbSubdivisionInSide=6

            setAllDichoLevelTo0=true

            constructor(){
                this.mamesh=new Mamesh()
            }

            go():Mamesh {

                //this.mamesh.linksOK=true
                
                    for (let i = 0; i < 3; i++) {
                        let param=new XYZ( Math.cos(2 * Math.PI * i / 3 - Math.PI / 2) ,  Math.sin(2 * Math.PI * i / 3 - Math.PI / 2) , 0)
                        let position=XYZ.newFrom(param)
                        let v=this.mamesh.newVertex(position,0,param)
                        v.markers.push(Vertex.Markers.corner)
                    }
                    this.mamesh.addATriangle(this.mamesh.vertices[0],this.mamesh.vertices[1],this.mamesh.vertices[2])

                let nbDic=Math.floor(Math.log(this.nbSubdivisionInSide)/Math.log(2))
                
                for (let dic=0;dic<nbDic;dic++){
                    let dicotomer=new mameshModification.TriangleDichotomer(this.mamesh)
                    dicotomer.makeLinks=false
                    dicotomer.go()
                }



                if (Math.pow(2,nbDic)!=this.nbSubdivisionInSide){
                    let dicotomer=new mameshModification.TriangleDichotomer(this.mamesh)
                    dicotomer.makeLinks=false
                    dicotomer.go()
                }



                /** to detect border we use the triangles*/
                let linkMaker=new linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(this.mamesh)
                linkMaker.markIsolateVertexAsCorner=false
                linkMaker.goChanging()


                /**for each strate suppressed, the side decrease of 3 segments*/
                if (Math.pow(2,nbDic)!=this.nbSubdivisionInSide) {
                    
                    let supress=new grateAndGlue.ExtractCentralPart(this.mamesh,Math.floor((Math.pow(2,nbDic+1)-this.nbSubdivisionInSide)/3))
                    supress.markBorder=this.markBorder    
                    this.mamesh=supress.go()
                    this.mamesh.isolateMameshVerticesFromExteriorVertices()
                    //mameshModification.suppressBorderStratesAndMarkTheNewBorder(,this.markBorder)
                }


                if (this.markCorner) {
                    for (let v of this.mamesh.vertices){
                        if (v.links.length==2) v.markers.push(Vertex.Markers.corner)
                    }
                }

                if(this.setAllDichoLevelTo0) for (let vertex of this.mamesh.vertices) vertex.dichoLevel=0

                spacialTransformations.adjustInASquare(this.mamesh,this.origin,this.end)

                
                

                return this.mamesh

            }
            
        }
        

        export class TriangulatedPolygone{
            
            private nbSides:number
            private mamesh:Mamesh
            
            markCorner=true
            markBorder=true

            origin=new XYZ(-1,-1,0)
            end=new XYZ(1,1,0)
            
            nbSubdivisionInARadius=1
            setAllDichoLevelTo0=true


            constructor(nbSides:number){
                this.mamesh=new Mamesh()
                this.nbSides=nbSides
            }

            go():Mamesh {

                //this.mamesh.linksOK=true

                
                    let vert0=this.mamesh.newVertex(new XYZ(0,0,0),0,new XYZ(0,0,0))
                vert0.markers.push(Vertex.Markers.center)
                    for (let i = 0; i < this.nbSides; i++) {
                        let param=new XYZ( Math.cos(2 * Math.PI * i / this.nbSides - Math.PI / 2) ,  Math.sin(2 * Math.PI * i / this.nbSides - Math.PI / 2) , 0)
                        let position=XYZ.newFrom(param)
                        let v=this.mamesh.newVertex(position,0,param)
                        //if(this.markCorner) v.markers.push(Vertex.Markers.corner)
                        if(this.markBorder) v.markers.push(Vertex.Markers.border)

                    }

                    for (let i = 1; i < this.nbSides + 1; i++) {
                        this.mamesh.addATriangle(this.mamesh.vertices[0],this.mamesh.vertices[i],this.mamesh.vertices[i % this.nbSides + 1])
                    }

                    if (this.nbSides%2==0){
                        for (let i=1;i<=this.nbSides/2;i++){
                            vert0.setTwoOppositeLinks(this.mamesh.vertices[i],this.mamesh.vertices[i+this.nbSides/2])
                        }
                    }
                    else{
                        for (let i=1;i<=this.nbSides;i++) vert0.setOneLink(this.mamesh.vertices[i])
                    }

                    for (let i=1;i<=this.nbSides;i++){
                        let verti=this.mamesh.vertices[i]
                        let vertNext=(i==this.nbSides)? this.mamesh.vertices[1]:this.mamesh.vertices[i+1]
                        let vertPrev=(i==1)? this.mamesh.vertices[this.nbSides]:this.mamesh.vertices[i-1]

                        verti.setOneLink(vert0)
                        // if (this.aLoopLineAround) verti.setTwoOppositeLinks(vertPrev,vertNext)
                        // else{
                             verti.setOneLink(vertNext)
                             verti.setOneLink(vertPrev)
                        // }
                    }



                let nbDic=Math.log(this.nbSubdivisionInARadius)/Math.log(2)
                for (let dic=0;dic<nbDic;dic++){
                    let dicotomer=new mameshModification.TriangleDichotomer(this.mamesh)
                    dicotomer.makeLinks=true
                    dicotomer.go()
                }
                if (nbDic!=Math.floor(nbDic)) {
                    /**one more dichotomy to add too much strates, and suppress some*/
                    let dicotomer=new mameshModification.TriangleDichotomer(this.mamesh)
                    dicotomer.makeLinks=true
                    dicotomer.go()


                    let supress=new grateAndGlue.ExtractCentralPart(this.mamesh,-this.nbSubdivisionInARadius)
                    supress.markBorder=this.markBorder
                    this.mamesh=supress.go()
                    this.mamesh.isolateMameshVerticesFromExteriorVertices()
                    
                    ///mameshModification.suppressBorderStratesAndMarkTheNewBorder(this.IN_mamesh,-this.nbSubdivisionsInARadius,this.markBorder)
                }


                if (this.markCorner) {
                    for (let v of this.mamesh.vertices){
                        if (v.links.length==3) v.markers.push(Vertex.Markers.corner)
                    }
                }
                
                spacialTransformations.adjustInASquare(this.mamesh,this.origin,this.end)
                if(this.setAllDichoLevelTo0) for (let vertex of this.mamesh.vertices) vertex.dichoLevel=0


                //this.mamesh.symmetries=symmetries.getAllPolygonalRotations(this.nbSides)
                
                
                return this.mamesh

            }

        }


        

        export class BasisForRegularReseau{
            nbI=3
            set_nbJ_toHaveRegularReseau=false
            nbJ=3
            origin=new XYZ(0,0,0)
            end=new XYZ(1,1,0)

            kComponentTranslation=0
            nbVerticalDecays=0
            nbHorizontalDecays=0
            /**only usefull when we use set_nbJ_toHaveRegularReseau=true*/
            squareMailleInsteadOfTriangle=true
            
            

            go():{Vi:XYZ,Vj:XYZ,nbI:number,nbJ:number}{
                this.checkArgs()

                
                let deltaX=(this.end.x-this.origin.x)/(this.nbI-1)
                let deltaY
                if (this.set_nbJ_toHaveRegularReseau){
                    if(this.squareMailleInsteadOfTriangle)deltaY=deltaX
                    else deltaY=deltaX*Math.sqrt(3)/2
                    this.nbJ=Math.floor(((this.end.y-this.origin.y)/deltaY+1))
                }
                else{
                    deltaY=(this.end.y-this.origin.y)/(this.nbJ-1)
                }
                
                let A=(this.end.x-this.origin.x)
                let B=(this.end.y-this.origin.y)


                let VX=this.computeDecayVector(deltaX,A,deltaY,B,this.nbVerticalDecays,this.nbHorizontalDecays)
                let preVY=this.computeDecayVector(deltaY,B,deltaX,A,this.nbHorizontalDecays,this.nbVerticalDecays)
                let VY=new XYZ(preVY.y,preVY.x,0)

                VX.z+=this.kComponentTranslation
                VY.z+=this.kComponentTranslation

                return {Vi:VX,Vj:VY,nbI:this.nbI,nbJ:this.nbJ}
            }


            private checkArgs(){

                let A=(this.end.x-this.origin.x)
                let B=(this.end.y-this.origin.y)

                if (Math.abs(A)<geo.epsilon||Math.abs(B)<geo.epsilon) throw 'origin and end are almost in the same line'

                if (this.nbI<2) throw 'this.nbI must be >=2'
                if (this.nbJ<2) throw 'this.nbJ must be >=2'


            }



            private computeDecayVector(a,A,b,B,dV,dH):XYZ{
                let res=new XYZ(0,0,0)
                res.x= a*A*B/( A*B - a*b*dH *dV )
                res.y=b*dV/A*res.x
                return res
            }



        }



        var aParam=new XYZ(0,0,0)
        function makeLinksFromDeltaParam(cell:Vertex, dir1:XYZ, dir2:XYZ,paramToVertex:HashMap<XYZ,Vertex>):void{
            {
                aParam.copyFromFloats(cell.param.x,cell.param.y,cell.param.z).add(dir1)
                let c:Vertex = paramToVertex.getValue(aParam)
                aParam.copyFromFloats(cell.param.x,cell.param.y,cell.param.z).add(dir2)
                let cc:Vertex =  paramToVertex.getValue(aParam)

                if (c != null && cc != null) cell.setTwoOppositeLinks(c,cc)
                else if (c == null && cc != null) cell.setOneLink(cc)
                else if (c != null && cc == null) cell.setOneLink(c)

            }
        }


        var tempPapa=new XYZ(0,0,0)
        function makeSquareFromDeltaParam(cell:Vertex, mamesh:Mamesh, dir1:XYZ, dir2:XYZ,paramToVertex:HashMap<XYZ,Vertex>):void{
            
                    let v1=cell
                    if (v1==null)  return;
                    
                    let v2=paramToVertex.getValue(tempPapa.copyFrom(cell.param).add(dir1)) //this.getVertex(i+1,j)
                    if (v2==null) return;
                    
                    let v3=paramToVertex.getValue(tempPapa.copyFrom(cell.param).add(dir1).add(dir2))//this.getVertex(i+1,j+1)
                    if (v3==null) return;
                    
                    let v4=paramToVertex.getValue(tempPapa.copyFrom(cell.param).add(dir2))
                    if (v4==null)  return;
                    
                    mamesh.addASquare(v1,v2,v3,v4)
           
        }
        
        

        export class Regular{


            nbI=3
            nbJ=3
            fixedK=0

            Vi=new XYZ(1,0,0)
            Vj=new XYZ(0,1,0)
            Vk=new XYZ(0,0,0)

            origine=new XYZ(0,0,0)

            private mamesh:Mamesh


            /**these 3 fields are reported on Regular3d*/
            makeLinks=true
            makeTriangleOrSquare=true
            squareVersusTriangleMaille=true
            oneMoreVertexForOddLine=false

            
            holeParameters=new HashMap<XYZ,boolean>()


            markCorner=true
            markBorder=true
            markCenter=true

            putAVertexOnlyAtXYZCheckingThisCondition:(xyz:XYZ)=>boolean=null

            constructor( generator?:BasisForRegularReseau){
                this.mamesh=new Mamesh()
                if (generator!=null){
                    let VV=generator.go()
                    this.Vi.copyFrom(VV.Vi)
                    this.Vj.copyFrom(VV.Vj)
                    this.nbI=VV.nbI
                    this.nbJ=VV.nbJ
                    this.origine.copyFrom(generator.origin)
                    this.squareVersusTriangleMaille=generator.squareMailleInsteadOfTriangle
                }

            }


            private checkArgs(){


                if (!this.makeTriangleOrSquare && !this.makeLinks) logger.c('few interest if you do not add neither square nor links')
                
                let cros=new XYZ(0,0,0)
                geo.cross(this.Vi,this.Vj,cros)
                if (cros.x==Number.NaN||cros.y==Number.NaN||cros.z==Number.NaN) throw 'a problem with Vi of Vj'
                if (cros.length()<geo.epsilon) throw 'origin and end are almost in the same line'

            }



            private _xyz=new XYZ(0,0,0)
            private getVertex(i:number,j:number):Vertex{
                this._xyz.x=i
                this._xyz.y=j
                this._xyz.z=this.fixedK

                return this.paramToVertex.getValue(this._xyz)//this.paramToVertex[i+','+j]
            }

            
            private _iDirection=new XYZ(0,0,0)
            private _jDirection=new XYZ(0,0,0)
            private _kDirection=new XYZ(0,0,0)


            paramToVertex=new HashMap<XYZ,Vertex>(true)

            go():Mamesh{


                this.checkArgs()


                for (let i=0; i<this.nbI; i++){
                    for (let j=0; j<this.nbJ; j++){

                        let param = new XYZ(i, j, this.fixedK)
                        if (this.holeParameters==null ||  !this.holeParameters.getValue(param)) {

                            let decay= (!this.squareVersusTriangleMaille && j%2==0)? 0.5 : 0
                            this._iDirection.copyFrom(this.Vi).scale(i+decay)
                            this._jDirection.copyFrom(this.Vj).scale(j)
                            this._kDirection.copyFrom(this.Vk).scale(this.fixedK)
                            let position =  new XYZ(0,0,0).add(this._iDirection).add(this._jDirection).add(this._kDirection).add(this.origine)

                            if (this.putAVertexOnlyAtXYZCheckingThisCondition==null || this.putAVertexOnlyAtXYZCheckingThisCondition(position)){
                                let vertex = this.mamesh.newVertex(position,0,param)
                                this.paramToVertex.putValue(param,vertex)
                            }
                        }
                    }
                }

                /**to get a vertical symmetry when vertex are in quinconce*/
                if (this.oneMoreVertexForOddLine){
                    let i=this.nbI
                    for (let j=0; j<this.nbJ; j++){
                        if (j%2==1) {
                            let param = new XYZ(i, j, this.fixedK)
                            if (this.holeParameters == null || !this.holeParameters.getValue(param)) {

                                let decay = (!this.squareVersusTriangleMaille && j % 2 == 0) ? 0.5 : 0
                                this._iDirection.copyFrom(this.Vi).scale(i + decay)
                                this._jDirection.copyFrom(this.Vj).scale(j)
                                this._kDirection.copyFrom(this.Vk).scale(this.fixedK)
                                let position = new XYZ(0, 0, 0).add(this._iDirection).add(this._jDirection).add(this._kDirection).add(this.origine)

                                if (this.putAVertexOnlyAtXYZCheckingThisCondition == null || this.putAVertexOnlyAtXYZCheckingThisCondition(position)) {
                                    let vertex:Vertex = this.mamesh.newVertex(position, 0, param)
                                    this.paramToVertex.putValue(param,vertex)

                                }

                            }
                        }
                    }
                }
                
                
                




                if (this.mamesh.vertices.length==0) console.log('you have created a IN_mamesh with no vertex. Perhaps because of {@link Regular.putAVertexOnlyAtXYZCheckingThisCondition }')



                
                if (this.makeLinks) {
                    //this.mamesh.linksOK=true
                    if (!this.squareVersusTriangleMaille) this.linksCreationForTriangle()
                    else this.linksCreationForSquare()
                }

                if (this.makeTriangleOrSquare) {
                    if (!this.squareVersusTriangleMaille) this.triangleCreation()
                    else   this.squareCreation()
                }




                if (this.markBorder){
                    if (this.squareVersusTriangleMaille){
                        for (let v of this.mamesh.vertices) if (v.links.length!=4) v.markers.push(Vertex.Markers.border)
                    }
                    else{
                        for (let v of this.mamesh.vertices) if (v.links.length!=6) v.markers.push(Vertex.Markers.border)
                    }
                }



                if (this.markCorner){

                    let oneMore=(this.oneMoreVertexForOddLine&&this.nbJ%2==0)?1:0

                    let vertex:Vertex
                    vertex=this.getVertex(0,0)
                    if (vertex!=null)  vertex.markers.push(Vertex.Markers.corner)
                    vertex=this.getVertex(this.nbI-1+oneMore,this.nbJ-1)
                    if (vertex!=null)  vertex.markers.push(Vertex.Markers.corner)
                    vertex=this.getVertex(0,this.nbJ-1)
                    if (vertex!=null)  vertex.markers.push(Vertex.Markers.corner)
                    vertex=this.getVertex(this.nbI-1,0)
                    if (vertex!=null)  vertex.markers.push(Vertex.Markers.corner)
                }

                
                if (this.markCenter){
                    let iCenter=this.nbI/2
                    let iCenters=[]
                    if (Math.floor(iCenter)!=iCenter){
                        iCenters.push(Math.floor(iCenter))
                    }
                    else iCenters.push(Math.floor(iCenter),Math.floor(iCenter)-1)

                    let jCenter=this.nbJ/2
                    let jCenters=[]
                    if (Math.floor(jCenter)!=jCenter){
                        jCenters.push(Math.floor(jCenter))
                    }
                    else jCenters.push(Math.floor(jCenter),Math.floor(jCenter)-1)
                    
                    for (let i of iCenters){
                        for (let j of jCenters){
                            let vertex=this.getVertex(i,j)
                            if(vertex!=null) vertex.markers.push(Vertex.Markers.center)
                        }
                    }

                }
                
                
                //this.mamesh.symmetries=symmetries.cartesianAsArray(this.nbI,this.nbJ,this.oneMoreVertexForOddLine)

                return this.mamesh
            }





            private linksCreationForSquare():void{


                this.mamesh.vertices.forEach((cell:Vertex)=> {

                    makeLinksFromDeltaParam(cell, XYZ.temp0(1,0,0),XYZ.temp1(-1,0,0),this.paramToVertex)
                    makeLinksFromDeltaParam(cell, XYZ.temp0(0,1,0),XYZ.temp1(0,-1,0),this.paramToVertex)


                    // {
                    //     let c:Vertex = this.getVertex(cell.param.x + 1, cell.param.y)
                    //     let cc:Vertex = this.getVertex(cell.param.x - 1, cell.param.y)
                    //
                    //     if (c != null && cc != null) cell.setTwoOppositeLinks(c,cc,false)
                    //     else if (c == null && cc != null) cell.setOneLink(cc,true)
                    //     else if (c != null && cc == null) cell.setOneLink(c,true)
                    //
                    // }
                    //
                    // {
                    //
                    //     let c:Vertex = this.getVertex(cell.param.x  , cell.param.y+1);
                    //     let cc:Vertex = this.getVertex(cell.param.x  , cell.param.y-1);
                    //     if (c != null && cc != null) cell.setTwoOppositeLinks(c,cc,false)
                    //     else if (c == null && cc != null) cell.setOneLink(cc,true)
                    //     else if (c != null && cc == null) cell.setOneLink(c,true)
                    //
                    // }



                });


            }



            
            private squareCreation(){
                
                let dir1=new XYZ(1,0,0)
                let dir2=new XYZ(0,1,0)
                for (let vertex of this.mamesh.vertices){
                    makeSquareFromDeltaParam(vertex,this.mamesh,dir1,dir2,this.paramToVertex)
                }
                
                // for (let i = 0; i<this.nbI-1; i++){
                //     for (let j=0; j<this.nbJ-1; j++){
                //
                //         let v1=this.getVertex(i,j)
                //         if (v1==null)  continue;
                //
                //         let v2=this.getVertex(i+1,j)
                //         if (v2==null) continue;
                //
                //         let v3=this.getVertex(i+1,j+1)
                //         if (v3==null) continue;
                //
                //         let v4=this.getVertex(i,j+1)
                //         if (v4==null)  continue;
                //
                //         this.IN_mamesh.addASquare(v1,v2,v3,v4)
                //     }
                // }

                
            }


            private linksCreationForTriangle(){


                this.mamesh.vertices.forEach((cell:Vertex)=> {

                    makeLinksFromDeltaParam(cell,XYZ.temp0(1,0,0),XYZ.temp1(-1,0,0),this.paramToVertex)
                    
                    /**even lines */
                    if (cell.param.y%2==0){
                        /** sud est - nord ouest*/
                        makeLinksFromDeltaParam(cell,XYZ.temp0(1,1,0),XYZ.temp1(0,-1,0),this.paramToVertex)
                        /** sud ouest - nord est*/
                        makeLinksFromDeltaParam(cell,XYZ.temp0(0,1,0),XYZ.temp1(1,-1,0),this.paramToVertex)

                    }
                    /**odd lines */
                    else {
                        /**sud est - nord ouest*/
                        makeLinksFromDeltaParam(cell,XYZ.temp0(0,1,0),XYZ.temp1(-1,-1,0),this.paramToVertex)

                        /**sud ouest - nord est*/
                        makeLinksFromDeltaParam(cell,XYZ.temp0(-1,1,0),XYZ.temp1(0,-1,0),this.paramToVertex)
                    }

                });

            }


            private triangleCreation(){

                for (let vertex of this.mamesh.vertices){

                    let i=vertex.param.x
                    let j=vertex.param.y


                    if (j%2==0){
                        let v1=vertex

                        let v2=this.getVertex(i+1,j+1)
                        if (v2==null)  continue


                        let v3=this.getVertex(i,j+1)
                        if (v3!=null)this.mamesh.addATriangle(v1,v2,v3)


                        let v4=this.getVertex(i+1,j)
                        if (v4!=null)this.mamesh.addATriangle(v1,v4,v2)
                    }
                    else{
                        let v1=vertex

                        let v2=this.getVertex(i,j+1)
                        if (v2==null)  continue


                        let v3=this.getVertex(i+1,j)
                        if (v3!=null)this.mamesh.addATriangle(v1,v3,v2)


                        let v4=this.getVertex(i+1,j+1)
                        if (v4!=null)this.mamesh.addATriangle(v2,v3,v4)
                    }

                    
                }


            }
            
        }

        export class Regular1D{

            origin=new XYZ(0,0,0)
            end=new XYZ(1,0,0)

            constructor(
                public size=5
            ){}


            go():Mamesh{
                let res=new Mamesh()

                for (let i=0;i<this.size;i++){
                    let vertex=new Vertex()
                    vertex.position=this.iToXYX(i)
                    res.vertices.push(vertex)
                }

                for (let i=1;i<this.size-1;i++) {
                    res.vertices[i].setTwoOppositeLinks(res.vertices[i-1],res.vertices[i+1])
                }
                res.vertices[0].setOneLink(res.vertices[1])
                res.vertices[this.size-1].setOneLink(res.vertices[this.size-2])
                return res
            }


            private iToXYX(i:number):XYZ{
                let delta= i/(this.size-1)
                return XYZ.newFrom(this.end).substract(this.origin).scale(delta).add(this.origin)

            }





        }



        export class Regular3D{

            nbI=3
            nbJ=3
            nbK=3
            Vi=new XYZ(1,0,0)
            Vj=new XYZ(0,1,0)
            Vk=new XYZ(0,0,1)

            origine=new XYZ(0,0,0)
            decayOddStrates=false


            /**these 3 fields are reported on Regular3d*/
            makeLinks=true
            makeTriangleOrSquare=true
            strateHaveSquareMailleVersusTriangleMaille=true
            oneMoreVertexForOddLine=false

            interStrateMailleAreSquareVersusTriangle=true


            createJKSquares=true
            createIKSquaresOrTriangles=true

            putAVertexOnlyAtXYZCheckingThisCondition:(xyz:XYZ)=>boolean=null
            paramToVertex=new HashMap<XYZ,Vertex>()

            mamesh:Mamesh

            constructor(){

            }


            go():Mamesh{
                
                this.mamesh=new Mamesh()

                //this.mamesh.linksOK=true
                
                
                let xDecay=new XYZ(0,0,0)
                if (this.decayOddStrates) xDecay.add(this.Vi).scale(0.5)


                
                for (let k=0; k<this.nbK; k++){

                    let twoD=new Regular()
                    twoD.makeTriangleOrSquare=this.makeTriangleOrSquare
                    twoD.makeLinks=true
                    twoD.oneMoreVertexForOddLine=this.oneMoreVertexForOddLine
                    twoD.squareVersusTriangleMaille=this.strateHaveSquareMailleVersusTriangleMaille

                    twoD.nbI=this.nbI
                    twoD.nbJ=this.nbJ
                    twoD.fixedK=k
                    twoD.Vi=this.Vi
                    twoD.Vj=this.Vj
                    twoD.Vk.copyFrom(this.Vk)
                    
                    twoD.origine=XYZ.newFrom(this.origine)
                    if (k%2==1) twoD.origine.substract(xDecay)
                    
                    twoD.putAVertexOnlyAtXYZCheckingThisCondition=this.putAVertexOnlyAtXYZCheckingThisCondition
                    /** chaque strate est un mamesh. On ne les mémorise plus comme avant*/
                    let twoDimMamesh=twoD.go()
                    for (let entry of twoD.paramToVertex.allEntries()){
                       this.mamesh.vertices.push(entry.value)
                       this.paramToVertex.putValue(entry.key,entry.value)
                    }
                    for (let vertex of twoDimMamesh.smallestSquares) this.mamesh.smallestSquares.push(vertex)
                    for (let vertex of twoDimMamesh.smallestTriangles) this.mamesh.smallestTriangles.push(vertex)

                }
                
                
                
                if (this.interStrateMailleAreSquareVersusTriangle){
                    this.linksCreationForSquareMaille()
                    if (this.createJKSquares) {
                        let dir1=new XYZ(0,1,0)
                        let dir2=new XYZ(0,0,1)
                        this.mamesh.vertices.forEach(v=> {
                            makeSquareFromDeltaParam(v, this.mamesh, dir1, dir2,this.paramToVertex)
                        })
                    }
                    if (this.createIKSquaresOrTriangles) {
                        let dir1=new XYZ(1,0,0)
                        let dir2=new XYZ(0,0,1)
                        this.mamesh.vertices.forEach(v=> {
                            makeSquareFromDeltaParam(v, this.mamesh, dir1, dir2,this.paramToVertex)
                        })
                    }
                }
                else  {
                    this.linksCreationForTriangleMaille()
                    if (this.createJKSquares) {
                        let dir1=new XYZ(0,1,0)
                        let dir2=new XYZ(0,0,1)
                        this.mamesh.vertices.forEach(v=> {
                            makeSquareFromDeltaParam(v, this.mamesh, dir1, dir2,this.paramToVertex)
                        })
                    }
                    if (this.createIKSquaresOrTriangles) {
                        this.triangleCreation()
                    }
                }


                
                
                
                
                //
                //
                // if (this.createIMameshes) {
                //     for (let i = 0; i < this.nbI; i++) {
                //
                //         let mamesh = new Mamesh()
                //         this.mamesh3D.iMameshes.push(mamesh)
                //
                //         for (let j = 0; j < this.nbJ; j++) {
                //             for (let k = 0; k < this.nbK; k++) {
                //                 let genericParam=new XYZ(i, j, k)
                //                 let vertex = this.mamesh3D.iMameshes[k].findVertexFromParam(genericParam)
                //                 if (vertex != null) {
                //                     mamesh.vertices.push(vertex)
                //                     this.paramToVertex.putValue(genericParam,vertex)
                //
                //                 }
                //
                //             }
                //         }
                //
                //
                //
                //         mamesh.vertices.forEach(cell=> {
                //             makeLinksFromDeltaParam(cell, mamesh, XYZ.temp0(0, 1, 0), XYZ.temp1(0, -1, 0),this.paramToVertex)
                //             makeLinksFromDeltaParam(cell, mamesh, XYZ.temp0(0, 0, 1), XYZ.temp1(0, 0, -1),this.paramToVertex)
                //         })
                //         mamesh.linksOK = true
                //
                //
                //
                //         if (this.makeSquares) {
                //             let dir1=new XYZ(0,1,0)
                //             let dir2=new XYZ(0,0,1)
                //             mamesh.vertices.forEach(v=> {
                //                 makeSquareFromDeltaParam(v, mamesh, dir1, dir2,this.paramToVertex)
                //             })
                //         }
                //
                //     }
                //
                // }
                //
                // if (this.createJMameshes) {
                //     for (let j = 0; j < this.nbJ; j++) {
                //
                //         let mamesh = new Mamesh()
                //         this.mamesh3D.jMameshes.push(mamesh)
                //
                //         for (let i = 0; i < this.nbI; i++) {
                //             for (let k = 0; k < this.nbK; k++) {
                //                 let genericParam=new XYZ(i, j, k)
                //                 let vertex = this.mamesh3D.kMameshes[k].findVertexFromParam(genericParam)
                //                 if (vertex != null) {
                //                     mamesh.vertices.push(vertex)
                //                     this.paramToVertex.putValue(genericParam, vertex)
                //                 }
                //
                //             }
                //         }
                //
                //         mamesh.vertices.forEach(cell=> {
                //             makeLinksFromDeltaParam(cell, mamesh, XYZ.temp0(1, 0, 0), XYZ.temp1(-1, 0, 0),this.paramToVertex)
                //             makeLinksFromDeltaParam(cell, mamesh, XYZ.temp0(0, 0, 1), XYZ.temp1(0, 0, -1),this.paramToVertex)
                //         })
                //         mamesh.linksOK = true
                //
                //         if (this.makeSquares) {
                //             let dir1 = new XYZ(1, 0, 0)
                //             let dir2 = new XYZ(0, 0, 1)
                //             mamesh.vertices.forEach(v=> {
                //                 makeSquareFromDeltaParam(v, mamesh, dir1, dir2,this.paramToVertex)
                //             })
                //         }
                //
                //     }
                // }


                return this.mamesh

            }


            private linksCreationForSquareMaille(){
                let vec001=new XYZ(0,0,1)
                let vec_001=new XYZ(0,0,-1)
                this.mamesh.vertices.forEach(v=> {
                    makeLinksFromDeltaParam(v , vec001, vec_001,this.paramToVertex)
                })
            }





            private linksCreationForTriangleMaille(){

                this.mamesh.vertices.forEach((cell:Vertex)=> {

                    /**even lines */
                    if (cell.param.z%2==0){
                        /** sud est - nord ouest*/
                        makeLinksFromDeltaParam(cell,XYZ.temp0(1,0,1),XYZ.temp1(0,0,-1),this.paramToVertex)
                        /** sud ouest - nord est*/
                        makeLinksFromDeltaParam(cell,XYZ.temp0(0,0,1),XYZ.temp1(1,0,-1),this.paramToVertex)

                    }
                    /**odd lines */
                    else {
                        /**sud est - nord ouest*/
                        makeLinksFromDeltaParam(cell,XYZ.temp0(0,0,1),XYZ.temp1(-1,0,-1),this.paramToVertex)

                        /**sud ouest - nord est*/
                        makeLinksFromDeltaParam(cell,XYZ.temp0(-1,0,1),XYZ.temp1(0,0,-1),this.paramToVertex)
                    }

                });

            }



            private getVertex(i,j,givenK):Vertex{
                return this.paramToVertex.getValue(new XYZ(i,givenK,j))
            }

            private triangleCreation(){
                for (let vertex of this.mamesh.vertices){

                    let i=vertex.param.x
                    let j=vertex.param.z
                    let k=vertex.param.y

                    if (j%2==0){
                        let v1=vertex

                        let v2=this.getVertex(i+1,j+1,k)
                        if (v2==null)  continue


                        let v3=this.getVertex(i,j+1,k)
                        if (v3!=null)this.mamesh.addATriangle(v1,v2,v3)


                        let v4=this.getVertex(i+1,j,k)
                        if (v4!=null)this.mamesh.addATriangle(v1,v4,v2)
                    }
                    else{
                        let v1=vertex

                        let v2=this.getVertex(i,j+1,k)
                        if (v2==null)  continue


                        let v3=this.getVertex(i+1,j,k)
                        if (v3!=null)this.mamesh.addATriangle(v1,v3,v2)


                        let v4=this.getVertex(i+1,j+1,k)
                        if (v4!=null)this.mamesh.addATriangle(v2,v3,v4)
                    }


                }


            }




        }

        //
        // export class Regular3Dold{
        //
        //     nbI=3
        //     nbJ=3
        //     nbK=3
        //     Vi=new XYZ(1,0,0)
        //     Vj=new XYZ(0,1,0)
        //     Vk=new XYZ(0,0,1)
        //
        //     origine=new XYZ(0,0,0)
        //     mamesh3D:Mamesh3dStratified
        //    
        //     createIMameshes=true
        //     createJMameshes=true
        //
        //     makeSquares=true
        //    
        //     putAVertexOnlyAtXYZCheckingThisCondition:(xyz:XYZ)=>boolean=null
        //     paramToVertex=new HashMap<XYZ,Vertex>()
        //
        //     constructor(mamesh3D:Mamesh3dStratified){
        //         this.mamesh3D=mamesh3D
        //     }
        //
        //
        //     goChanging(){
        //         for (let k=0; k<this.nbK; k++){
        //
        //             let twoD=new Regular()
        //             twoD.makeTriangleOrSquare=this.makeSquares
        //             twoD.nbI=this.nbI
        //             twoD.nbJ=this.nbJ
        //             twoD.fixedK=k
        //             twoD.Vi=this.Vi
        //             twoD.Vj=this.Vj
        //             twoD.Vk.copyFrom(this.Vk)
        //             twoD.origine=this.origine
        //             twoD.putAVertexOnlyAtXYZCheckingThisCondition=this.putAVertexOnlyAtXYZCheckingThisCondition
        //             this.mamesh3D.kMameshes[k]=twoD.goChanging()
        //
        //         }
        //
        //        
        //         if (this.createIMameshes) {
        //             for (let i = 0; i < this.nbI; i++) {
        //
        //                 let mamesh = new Mamesh()
        //                 this.mamesh3D.iMameshes.push(mamesh)
        //
        //                 for (let j = 0; j < this.nbJ; j++) {
        //                     for (let k = 0; k < this.nbK; k++) {
        //                             let genericParam=new XYZ(i, j, k)
        //                             let vertex = this.mamesh3D.iMameshes[k].findVertexFromParam(genericParam)
        //                             if (vertex != null) {
        //                                 mamesh.vertices.push(vertex)
        //                                 this.paramToVertex.putValue(genericParam,vertex)
        //
        //                             }
        //                        
        //                     }
        //                 }
        //
        //
        //
        //                 mamesh.vertices.forEach(cell=> {
        //                     makeLinksFromDeltaParam(cell, mamesh, XYZ.temp0(0, 1, 0), XYZ.temp1(0, -1, 0),this.paramToVertex)
        //                     makeLinksFromDeltaParam(cell, mamesh, XYZ.temp0(0, 0, 1), XYZ.temp1(0, 0, -1),this.paramToVertex)
        //                 })
        //                 mamesh.linksOK = true
        //
        //                
        //                
        //                 if (this.makeSquares) {
        //                     let dir1=new XYZ(0,1,0)
        //                     let dir2=new XYZ(0,0,1)
        //                     mamesh.vertices.forEach(v=> {
        //                         makeSquareFromDeltaParam(v, mamesh, dir1, dir2,this.paramToVertex)
        //                     })
        //                 }
        //                
        //             }
        //            
        //         }
        //
        //         if (this.createJMameshes) {
        //             for (let j = 0; j < this.nbJ; j++) {
        //
        //                 let mamesh = new Mamesh()
        //                 this.mamesh3D.jMameshes.push(mamesh)
        //
        //                 for (let i = 0; i < this.nbI; i++) {
        //                     for (let k = 0; k < this.nbK; k++) {
        //                         let genericParam=new XYZ(i, j, k)
        //                         let vertex = this.mamesh3D.kMameshes[k].findVertexFromParam(genericParam)
        //                         if (vertex != null) {
        //                             mamesh.vertices.push(vertex)
        //                             this.paramToVertex.putValue(genericParam, vertex)
        //                         }
        //
        //                     }
        //                 }
        //
        //                 mamesh.vertices.forEach(cell=> {
        //                     makeLinksFromDeltaParam(cell, mamesh, XYZ.temp0(1, 0, 0), XYZ.temp1(-1, 0, 0),this.paramToVertex)
        //                     makeLinksFromDeltaParam(cell, mamesh, XYZ.temp0(0, 0, 1), XYZ.temp1(0, 0, -1),this.paramToVertex)
        //                 })
        //                 mamesh.linksOK = true
        //
        //                 if (this.makeSquares) {
        //                     let dir1 = new XYZ(1, 0, 0)
        //                     let dir2 = new XYZ(0, 0, 1)
        //                     mamesh.vertices.forEach(v=> {
        //                         makeSquareFromDeltaParam(v, mamesh, dir1, dir2,this.paramToVertex)
        //                     })
        //                 }
        //
        //             }
        //         }
        //
        //
        //
        //
        //     }
        //
        //
        //
        //
        //
        //
        // }



    }
}