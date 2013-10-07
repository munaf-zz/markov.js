# Markov.js
This is a toy JavaScript library that uses [Markov Chains](https://en.wikipedia.org/wiki/Markov_chain) for text generation. I was inspired to do this while working on [Designer Ipsum](http://www.designeripsum.com). The implementation is not at all efficient, so I wouldn't rely on it for something critical (but why would you?).
## Example
If you supply the [Gettysburg Address](http://en.wikipedia.org/wiki/Gettysburg_Address) as an input, here is one possible output:
> We can long remember what they did here. It is rather to add or any nation conceived and that from these dead who fought here. We can not dedicate we have consecrated it can not consecrate we can never forget what they did here have come to the earth. We say here. Four score and proper that cause for us that from these honored dead we have thus far so nobly advanced. The people for us that all men living and so dedicated to dedicate a new birth of the brave men are engaged in a new birth of the people for us to dedicate we take increased devotion that that that that field as a final resting place for which they did here highly resolve that nation under god shall have come to that nation might live.

## Usage
### Include
```html
<script language="text/javascript" src="markov.js"></script>
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
