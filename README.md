# Markov.js
This is a toy JavaScript library that uses [Markov Chains](https://en.wikipedia.org/wiki/Markov_chain) for text generation. I was inspired to do this while working on [Designer Ipsum](http://www.designeripsum.com). The implementation is not at all efficient, so I wouldn't rely on it for something critical (but why would you?).
## Example
If you supply the [Gettysburg Address](http://en.wikipedia.org/wiki/Gettysburg_Address) as an input, here is one possible output:
>  It can long remember what they who struggled here, living, far above our fathers brought forth on a great task remaining before us that we take increased devotion that this. The people, or any nation, nor long endure. Four score and seven years ago our poor power to the unfinished work which they did here, in vain that that nation, or detract. It is altogether fitting and proper that that cause for the brave men, to the people, to the brave men, but it is for those who here highly resolve that cause for us to the unfinished work which they gave their lives that all men are created equal.

## Usage
### Include
```html
<script src="markov.js"></script>
```
### Instantiate
```javascript
var markov = new Markov();
markov.addCorpus("Four score and seven..."); // add a training corpus
markov.addCorpus("I'm a lumberjack and..."); // add another...
```
Alternatively, you can instantiate it with a corpus.
```javascript
var markov = new Markov({
  inputText: "Four score and seven..."
});
```
### Generate
```javascript
var text = markov.generate(100); // generate 100 words
```
### Additional Options
If you always want to make sure your text ends with a complete sentence (rather than right in the middle), set `endWithCompleteSentence` to `true` when instantiating the object. This will generate more words than you requested in order to reach a complete sentence. By default, this option is set to `false`.
```javascript
var markov = new Markov({
  endWithCompleteSentence: true
});
```
## License
MIT.
