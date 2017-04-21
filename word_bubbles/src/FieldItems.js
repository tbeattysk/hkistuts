'use strict';
class FieldObject{
	constructor(x,y,width,height){
		this.x = x;
		this.y = y;
		this.vx = Math.random();
		this.vy = Math.random();
		this.w = width; 
		this.h = height;
		this.held = false;
		this.heldDown = false;
		this.mouseX;
		this.mouseY;
	}
	
	//Returns the field potential as the inverse
	getPotential(absX, absY, strength){
		if(this.held){
			return 5 * strength/(Math.sqrt( (Math.abs(absX - this.x)-this.w/4) * (Math.abs(absX - this.x)-this.w/4) + (Math.abs(absY - this.y)-this.h/4) * (Math.abs(absY - this.y)-this.h/4) ));
		}
		else return strength/(Math.sqrt( (Math.abs(absX - this.x)-this.w/4) * (Math.abs(absX - this.x)-this.w/4) + (Math.abs(absY - this.y)-this.h/4) * (Math.abs(absY - this.y)-this.h/4) ));
	}
	
	//Returns the corner of the shape - top left, top right, bottom right, bottom left
	getCorners(){
		this.x = this.nextX || this.x;
		this.y = this.nextY || this.y; 
		this.vx = this.nextVx || this.vx;
		this.vy = this.nextVy || this.vy; 
		return [[this.x-this.w/2, this.y-this.h/2],[this.x+this.w/2, this.y-this.h/2],
					[this.x+this.w/2, this.y+this.h/2],[this.x-this.w/2, this.y+this.h/2]];
	}

	//for the given force this function calculates the average of the force and 
	//velocity vector for the new velocity vector.
	getNextLocation(force, distance, mouseX, mouseY, mouseDown, heldState){
		//check if user has clicked and held this object
		//if it was held down on the last loop, or if there is a new click
		//how we update this.mouseX will change position only if mouse down
		console.log(force);
		if(this.heldDown || (!heldState || this.held) && mouseX>this.x && mouseX<(this.x+this.w) && mouseY>this.y && mouseY<(this.y+this.h) ){
			if(mouseDown){
				this.nextX = this.x + mouseX - this.mouseX;
			    this.nextY = this.y + mouseY - this.mouseY;
				this.heldDown = true;
			}else this.heldDown = false;
			//console.log("this.mouseX: " + this.mouseX + "  mouseX: "+ mouseX );
			this.mouseX = mouseX;
			this.mouseY = mouseY;
			this.held = true;

			return{
				x: this.nextX,
				y: this.nextY,
				w: this.w,
				h: this.h
			}	
		}
		else this.held = false;
		//distance * unit vector to move 1px per cycle
		this.nextVx = distance * (force.fx * 0.0001 + this.vx) 
						/ Math.sqrt((force.fx * 0.0001 + this.vx) 
						* (force.fx * 0.0001 + this.vx) 
						+ (force.fy * 0.0001 + this.vy) 
						* (force.fy * 0.0001 + this.vy));
		this.nextVy = distance * (force.fy * 0.0001 + this.vy) 
						/ Math.sqrt((force.fx * 0.0001 + this.vx) 
						* (force.fx * 0.0001 + this.vx) 
						+ (force.fy * 0.0001 + this.vy) 
						* (force.fy * 0.0001 + this.vy));
		this.nextX = this.x + (this.nextVx);
		this.nextY = this.y + (this.nextVy);
		return {
			x: this.nextX,
			y: this.nextY,
			w: this.w,
			h: this.h
		}
	}
}


class FieldBackground{
	constructor(width,height){
		this.w = width;
		this.h = height;
	}
	resize(w,h){
		this.w=w;
		this.h=h;
	}
	//Returns the field potential as spherical where center is zero
	getPotential(absX, absY){
			//return Math.pow(fromCx,2)+Math.pow(fromCy,2)
			return Math.sqrt(Math.pow(Math.abs(absX-this.w/2),4)+Math.pow(Math.abs(absY-this.h/2),4))

	}
}