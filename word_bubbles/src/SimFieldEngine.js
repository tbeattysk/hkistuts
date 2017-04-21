'use strict';
class SimEngine{
	constructor(width, height){
        this.w = width;
        this.h = height;
		this.background = new FieldBackground(width,height);
        this.objects = new Array;
        this.objectBeingHeld = false;
	}
    resize(w,h){
        this.w=w;
        this.h=h;   
        this.background.resize(w,h);
    }
    //returns the next location of the objects
    getNextFrame(distance, mouseX, mouseY, mouseDown){
       // console.log(this.isAnyObjectHeld());
        this.objectBeingHeld = this.isAnyObjectHeld();

        return this.objects.map(object => object.getCorners()) //get the corners for each object
            .map((corners,i) => this.measureForce(corners,i)) // from the 4 corners get the force acting on each object (fx,fy)
            .map((force,i) => this.objects[i].getNextLocation(force, distance, mouseX, mouseY, mouseDown, this.objectBeingHeld));//get the next location of each object based on this force
    }

    isAnyObjectHeld(){
        let held = false
        this.objects.forEach(object=>{
            if(object.held){
                held = true;
            }
        });
        return held;
    }
    //adds an object
    addObject(object){
        this.objects.push(object);
    }
   
    //removes object at index i
    removeObject(i){
        this.objects.splice(i,1);
    }
    
    //finds the forces acting on an object given the location of it's corners
    measureForce(corners, obj){
        corners.forEach((corner,i,a)=>{
             var potential = this.background.getPotential(corner[0],corner[1]);
             this.objects.forEach((object,j)=>{
                if(j!=obj){
                    potential = potential + object.getPotential(corner[0],corner[1], Math.pow((this.w*this.h),1.2));
                };
             });
             a[i] = potential;
        });
        return {fx: (corners[0] + corners[3])/this.objects[obj].w - (corners[1] + corners[2])/this.objects[obj].w,
            fy: (corners[0] + corners[1])/this.objects[obj].h - (corners[2] + corners[3])/this.objects[obj].h
        }
    }
	
}