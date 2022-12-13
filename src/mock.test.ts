export type matrix = number[][];

function determinant(A:matrix):number{
  return (A[0][0]*A[1][1])-(A[0][1]*A[1][0])
}

function getRandomInt(min:number,max:number):number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function randomMatrix(min:number,max:number):matrix{
  return [
    [ getRandomInt(min,max), getRandomInt(min,max) ],
    [ getRandomInt(min,max), getRandomInt(min,max) ]
  ]
}

function invertibilty(iterations=10000,min=-10,max=10):number{
  const invertible:matrix[]=[];
  const noninvertible:matrix[]=[];
  for(let i = 0;i<iterations;i++){
    const m = randomMatrix(min,max);
    const det = determinant(m);
    if(det===0)noninvertible.push(m);
    else invertible.push(m);
  }
  return invertible.length/iterations;
}

function prettyPercent(num:number):string{
  return `${(num*100).toFixed(2)}%`
}

void function main(){
  console.log(`Percentage of Invertible 2x2 matrices, with intergers ranging from -5 to 5: ${prettyPercent(invertibilty(10000,-5,5))}`);
  console.log(`Percentage of Invertible 2x2 matrices, with intergers ranging from -10 to 10: ${prettyPercent(invertibilty(10000,-10,10))}`);
  console.log(`Percentage of Invertible 2x2 matrices, with intergers ranging from -50 to 50: ${prettyPercent(invertibilty(10000,-50,50))}`);
}();