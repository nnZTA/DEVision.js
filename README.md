<p align="center">
  <img src="DEVision.png"/>
</p>

DEVision is intended as a drop-in replacement for console.log, with the following features:
 - Fast
 - Isomorphic
 - Elegant API
 - Browser/Platform Independent
 - *... did we mention, Fast?* 


# <a name="toc"></a>Table of contents
- [Authors](#authors)
- [Overview](#overview)
- [Setup](#setup)
- [Usage](#usage)
- [Documentations](#documentation)
    - [Main API](#api)
    - [Export Test Scripts](#export)
    - [Utilities](#utils)
- [More](#contributing)

<br>

# <a name="overview"></a>DEVision.js Overview #
## Problem ##
 - No run-time debug tracking in JavaScript that's browser and platform independent.
 - Currently all console.log messages will run into one another & overlap
 - Once done with console.logs, need to comment / uncomment  may lead to errors
 - No “history” of a variable’s value and “tracing” done manually
 - No “diff’ing” to visually highlight the changes
 - Tracing (during development) & Testing (post development) usually violate the DRY concept in work flow context
## Solution ##
 - An improved console.log replacement allowing the developer to decide (at run-time)* what will be logged based on both priority level & user-defined scope with the ability to track/snapshot variable values and test their values.

<br>

# <a name="setup"></a>DEVision.js Setup #
#### Setup in Node.js
```js
const dev = require("devision.js");
```
#### Setup in Front-End
```html
<head>
    <script src="../node_modules/devision.js/library/devision.js"></script>
    <script src="../node_modules/devision.js/library/testViewHTML.js"></script>
    <script src="../node_modules/devision.js/library/testView.js"></script>
</head>
```
<br><br>

# <a name="usage"></a>DEVision.js HowTo #
## Usage in General 
In fullfilling DEVision's primary purpose of being a drop-in replacement for ```console.log``` it is easiest to think of it as a Log Butler that takes care of your diagnostic household.  As is the Butler, it will be the gatekeeper for access to your logs.  There are two primary methods (during runtime) which allow you to control your diagnostic data flow:
```
    dev.currentPriority = 0;
    dev.currentScope = ['global', 'appRunTime', 'dataIO', 'foo', ];
```
**```currentPriority```** is a threshold for logging without semantic (context) info beyond the severity of the message to be logged.  The implicit (automatic) default level for both ```dev.currentPriority``` && ```dev.log(...)``` is 0 for all logged data.  Therefore, should you use only ```dev.log(...)``` without specifying a priority (as the second argument) you will be able to turn off **all** console logs by simply setting:
```
    dev.currentPriority = 1;
```
... this value can be changed either at the terminal in your application, or if on the front end, in a dynamically loaded HTML interface.
**```currentScope```** is similarly a permissive filter for your data...  it will allow any data to be displayed that contains the same scope tag(s) as currently within the ```dev.currentScope[]``` array to be displayed.
Let's look at a very simple example:
```js
dev.log("Developer Debug Message");
dev.log("Database Connection Successful <*important status update*>", 13, 'db');
dev.log("File Write Failure <*critical alert/error*>", 42, ['error', 'devOps']);
dev.log("Database Connection Failure <*critical alert/error*>", 42, ['error', 'db', 'network']);
```
Given the defaults of ```currentPriority===0``` && ```currentScope===[]``` the output would be:
```js
Developer Debug Message
File Write Failure <*critical alert/error*>
Database Connection Successful <*important status update*>
Database Connection Failure <*critical alert/error*>
```
Given ```currentPriority===42``` && ```currentScope===[]``` the output would be:
```js
File Write Failure <*critical alert/error*>
Database Connection Failure <*critical alert/error*>
```
Given ```currentPriority===99``` && ```currentScope===['db']``` the output would be:
```js
Database Connection Successful <*important status update*>
Database Connection Failure <*critical alert/error*>
```
**...** noting that we can achieve the same "goal" of only seeing the "high priority" items in the second & third examples; however, the first shows only by severity (both file && db) whereas the latter only shows based upon the contextual 'db' scope.


<br>

[Back to Top](#toc)
<br><br>

## <a name="api"></a>DEVision.js API
### dev.log(...) → drop-in replacement for console.log(...)
```js
//  exp === ExpressionToBeLogged
//  dev.log(exp);  // example
let x = 13;
dev.log("x === " + x);

//--->   x === 13
----------

//  clcsv === console.log style comma delimited expressions
//  note:  the [] surrounding clcsv are required for this functionality
//  dev.log([clcsv]);  // example
let y = {someNum:13};
dev.log(["y === ", y]);

//--->   y === ▶ Object { someNum: 13 }

----------

//  dev.log(<exp||clcsv>, priority = 0, scope);  // example
let w = 12;
let x = 13;
dev.currentPriority = x;
dev.log("w === " + w, w);
dev.log("x === " + x, x);

//--->   x === 13

```
### dev.peek({...}) → 'wrappers' dev.log(...) output with "varName === varVal" formatting
```js
dev.peek(...);
```
### dev.passThru(...) → an "in-line" log ... it returns what's being logged
```js
dev.passThru(...);
```
### dev.trace(...) → used to track an object's value at a specific point in code
```js
dev.trace(...);
```
### dev.track(..., true|false) → used to track an object's values until turned off (true|false)
```js
dev.track(...);
```
### dev.watch(...) → everything but test
```js
dev.watch(...);
```

<br>

[Back to Top](#toc)
<br><br>

## <a name ="export"></a>Exporting Test Scripts:
### dev.test(...) → used to generate Tape Test files (and in the future, possibly code coverage)
#### dev.end → property used by dev.test(...)

for multiple test cases for one objectToTest
```js
dev.test(objToTest, [{},{},{}], dev.end);
```
or for only one test case for one objectToTest
```js
dev.test(objToTest, {}, dev.end);
```
dev.test currently only supports these tape assertions: 
<br>equal, notEqual, deepEqual, notDeepEqual, deepLooseEqual, notDeepLooseEqual, ok, notOk, error, comment
```js 
----- inside srcFile.js:

function addTwo(num){
    return num + 2; 
}

module.exports = {
    addTwo
}
```

#### Assertion types: equal, notEqual, deepEqual, notDeepEqual, deepLooseEqual, notDeepLooseEqual 
```js
dev.test(addTwo, 
    {
        input: 2,
        type: 'equal', // assertion type
        expected: 4,
        msg: [optional]
    }, 
    dev.end
);
```

#### Assertion types: ok, notOk
ok : Assert that value is <i>truthy</i>
<br>notOk : Assert that value is <i>falsy</i>
```js
dev.test(addTwo, 
    {
        input: 2,
        type: 'ok',
        msg: [optional]
    },
    dev.end
);
```
#### Assertion type: error
Assert that e is <i>falsy</i>. If e is <i>non-falsy</i>, use its err.message as the description message.
```js
dev.test(addTwo,
    {
        type: 'error',
        e: 3,
        msg: 'uh oh'
    }, 
    dev.end
);
```

#### Assertion type: comment
Print a message without breaking the tap output.
```js
dev.test(addTwo,
    {
        type: 'comment',
        msg: 'Just leaving a comment here'
    }, 
    dev.end
);
```

#### Using multiple test cases with different assertion types on one objectToTest:
```js
dev.test(addTwo, 
    [
        {
            input: 2,
            type: 'equal',
            expected: 4,
            msg: 'should equal to 4'
        }, 
        {
            input: 2,
            type: 'notEqual',
            expected: 100,
            msg: 'should not equal to 100!'
        }, 
        {
            type: 'error',
            e: 3,
            msg: 'uh oh'
        }, 
        {
            input: 2,
            type: 'notOk',
        }
    ],
    dev.end
);
```
output in exported test file: 
```js
    test('TESTING addTwo', (t) => {
        t.equal(srcFile.addTwo(2), 4, 'should equal to 4');
        t.notEqual(srcFile.addTwo(2), 100, 'should not equal to 100!');
        t.error(srcFile.addTwo(3), 'uh oh');
        t.notOk(srcFile.addTwo(2));
    })
```

<br><br>

### dev.all(...) → "full-monty" dev function, same as calling [log && track &&|| test]
```js
// ... === <exp||clcsv>, objToTest, testCases, priority = 0, scope
dev.all(..., dev.end);
```


<br>

[Back to Top](#toc)
<br><br>

## <a name="utils"></a> dev Utils
### dev.JSs(...) → JSON.stringify(...)
```js
dev.JSs(...);
```
### dev.JSp(...) → JSON.parse(...)
```js
dev.JSp(...);
```
### dev.vw() → Launch dev Viewer
```js
dev.vw(...);
```

<br>

### *Multiply your productivity by using DEVision.js!* ☺
[Back to Top](#toc)
<br><br>

## <a name="authors"></a>Authors
* [**Ben**](https://github.com/benizra2)
* [**George**](https://github.com/PracticalCode)
* [**Jacqueline**](https://github.com/jqw-chang)

<br>

## <a name="contributing"></a> Contributing
If you would like to contribute, submit a pull request and update the README.md with details of changes.

<br>

## <a name="license"></a>License
<center><a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
</center>

<br>

[Back to Top](#toc)

<br><br>