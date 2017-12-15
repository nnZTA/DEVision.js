'use strict';

class DLLNode {
  constructor (data, idx) {
    this.idx = idx;
    this.data = data;
    this.ts = window.performance.now().toFixed(4);
    this.next = null;
    this.prev = null;
  }
}

class DoubleLinkedList {
  constructor(maxCountDesired = -1) {
    this.maxCountDesired = maxCountDesired;
    this.head = null;
    this.tail = null;
    this.count = 0;
  }
  
  get length() {
    return this.count;
  }
  
  addLast(data, idx = -1) {
    // Create a new Node
    const node = new DLLNode (data);
    
    if(this.count === 0) {
      // If this is the first Node, assign it to head
      node.idx = (idx === -1) ? 0 : idx;
      this.head = node;
    } else {
      // If not the first node, link it to the last node
      node.idx = (idx === -1) ? this.tail.idx + 1 : idx;
      node.prev = this.tail;
      this.tail.next = node;
    }
    
    this.tail = node;
    
    this.count += 1;
    let returnDLL;
    // console.log("this.count === ", this.count);
    // console.log("this.maxCountDesired === ", this.maxCountDesired);
    if(this.maxCountDesired > -1 && this.count > this.maxCountDesired) {
      // console.log("this.maxCountDesired exceeded by ", this.count - this.maxCountDesired)
      returnDLL = new DoubleLinkedList();
      returnDLL = this.removeFirst(this);
    }
    return returnDLL;
  }
  
  addFirst(data, idx = -1) {
    // Create a new Node
    const node = new DLLNode (data);
    
    // Save the first Node
    // const temp = this.head;
    node.next = this.head;
    
    // Point head to the new Node
    this.head = node;
    
    // Add the rest of node behind the new first Node
    // this.head.next = temp;
    
    this.count += 1;
    
    if(this.count === 1) {
      // If first node, 
      // point tail to it as well
      this.head.idx = (idx === -1) ? 0 : idx;
      this.tail = this.head;
    }
    else {
      node.next.prev = node;
      this.head.idx = (idx === -1) ? this.tail.idx + 1 : idx;
    }
    
    let returnDLL;
    // console.log("this.count === ", this.count);
    // console.log("this.maxCountDesired === ", this.maxCountDesired);
    if(this.maxCountDesired > -1 && this.count > this.maxCountDesired) {
      // console.log("this.maxCountDesired exceeded by ", this.count - this.maxCountDesired)
      returnDLL = new DoubleLinkedList();
      returnDLL.addLast = this.removeFirst(this);
    }
    return returnDLL;
  } 
  
  removeFirst() {
    let returnNode;
    if(this.count > 0) {
      returnNode = new DoubleLinkedList();
      returnNode.addLast(this.head.data, this.head.idx);
      // The head should point to the second element
      this.head = this.head.next;
      this.head.prev = null;
      
      this.count -= 1;
      
      if(this.count === 0) {
        // If list empty, set tail to null
        this.tail = null;  
      } 
    }
    return returnNode;
  }
  
  removeLast() {
    let returnNode;
    if(this.count > 0) {
      returnNode = new DoubleLinkedList();
      returnNode.addLast(this.tail.data, this.tail.idx);
      if(this.count === 1) {
        this.head = null;
        this.tail = null;
      } else {
        // Find the Node right before the last Node
        let current = this.head;
        while(current.next !== this.tail) {
          current = current.next;
        }
        
        current.next = null;
        this.tail = current;
      }
      this.count -= 1;
    }
    return returnNode;
  }
}


if (typeof window === 'undefined' && typeof process !== 'undefined') {
  // check to see if this is a node environment, since there is no DoubleLinkedList 
  module.exports = DoubleLinkedList;
}


/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// console.log("/////////////////////////////////////////////////////////////////////////");
// console.log("/////////////////////////////////////////////////////////////////////////");

// console.log("Setup DLL Test");

// let testDLL = new DoubleLinkedList(2);

// console.log("///>>>");
// testDLL.addLast(9);
// console.log(testDLL);
// console.log("///>>>");
// testDLL.addLast(11);
// console.log(testDLL);
// console.log("///>>>");
// console.log("///>>>!!!");
// console.log(testDLL.addLast(12));
// console.log("--->>>");
// console.log(testDLL);
// console.log("///>>>");
// testDLL.maxCountDesired = 3;
// testDLL.addFirst(10, 0);
// console.log(testDLL);
// console.log("--->>>");
// console.log(testDLL.removeFirst());
// console.log("///>>>");
// console.log(testDLL);
// console.log("///>>>");
// testDLL.addLast(13);
// console.log("///>>>");
// console.log(testDLL);
// console.log("--->>>");
// console.log(testDLL.removeLast());
// console.log("--->>>");
// console.log(testDLL);






// console.log("/////////////////////////////////////////////////////////////////////////");
// console.log("/////////////////////////////////////////////////////////////////////////");

// console.log(JSON.stringify(testDLL, null, 2));
// TypeError: Converting circular structure to JSON
// console.log(testDLL);

// (() => {
//   // todo, make isomorphic export  
// })();  //  end of module encapsulation, to prevent global namespace pollution
