Yet Another Diacritic Remover
=============================
But better, I think, read on... 

[![Coveralls Status][coveralls-image]][coveralls-url] [![Build Status][travis-image]][travis-url]

## The Problem

This is a non-broken diacritic remover. There are number of similar modules available but they're all based on the same code
and are all deficient in some cases, which is why I wrote this one. This implementation is also much faster than most 
of the diacritic removers I've tested and ever-so-slightly faster than the fastest, which may be important to you, if
you're grinding through a lot of strings. This is based on the same code as all the rest, original is here:
http://web.archive.org/web/20121231230126/http://lehelk.com:80/2011/05/06/script-to-remove-diacritics/

As far as I can tell, the version referenced above and all of the derived examples I have found, suffer from
not being able to strip all diacritics. Specifically, they fail when encountering words like `"Rügen"` it
fails to remove the diaresis forming the umlaut for the letter `"u"`. This because of the nature of the
algorithm which prevents it from detecting and removing combining characters, in this case the
_Combining Diacritical Marks (0300–036F)_ unicode block. The letter in question in our example is actually
a completely normal letter `"u"` which therefore does not get stripped (it doesn't need to be) followed by
a combining diaresis which modifies the preceeding letter. The diaresis does not register as a letter and will
be ignore by the standard algorithm. 

To illustrate with our example word above:

    // Word: Rügen
    // Raw hex, before processing by V8: 0x52 0x75 0xCC 0x88 0x67 0x65 0x6E
    
    Letter: R, code point: 0x52,   char code: 0x52
    Letter: u, code point: 0x75,   char code: 0x75
    Letter: ̈, code point:  0x0308, char code: 0x0308
    Letter: g, code point: 0x67,   char code: 0x67
    Letter: e, code point: 0x65,   char code: 0x65
    Letter: n, code point: 0x6e,   char code: 0x6e

Notice how the the five letters in the word are unaccented. Also, notice how the diaresis appears on top of the comma.
That's how a combining character works. This is why the normal strip routine fails, all it sees are five normal
letters and one "letter" that isn't recongized as such.

I have modified the code below to correctly strip out combining characters. The combining characters are

* _Combining Diacritical Marks (0300–036F)_, since version 1.0, with modifications in subsequent versions down to 4.1
* _Combining Diacritical Marks Extended (1AB0–1AFF)_, version 7.0
* _Combining Diacritical Marks Supplement (1DC0–1DFF)_, versions 4.1 to 5.2
* _Combining Diacritical Marks for Symbols (20D0–20FF)_, since version 1.0, with modifications in subsequent versions down to 5.1
* _Combining Half Marks (FE20–FE2F)_, versions 1.0, with modifications in subsequent versions down to 8.0

## Other Options

You can perform [unicode normalization](https://en.wikipedia.org/wiki/Unicode_equivalence#Normalization) and avoid
doing the combining character strip but that would actually involve more work. You can also check your string to see if it
comprises only [precomposed characters](https://en.wikipedia.org/wiki/Precomposed_character) and can therefore benefit from
using a simplified strip function. Of course, that test has a computational cost that probably makes that process not
worthwhile. Note that you'll find several modules on `npm` that claim to perform normalizing of unicode strings. They are 
using the term in a misleading manner. All the ones I've seen do the same as this module: strip diacritics. A proper 
normalization function would take the combining character and the character it modifies and replace them with the 
precomposed version.

## Usage

```js
const
     strip = require( 'yads' ),
     testStr = `Rügen caractères spéciaux contrairement à la langue française`;

console.log( `${testStr} =>\n${strip.precomposed( testStr )}` );
// Rügen caractères spéciaux contrairement à la langue française =>
// Rügen caracteres speciaux contrairement a la langue francaise

console.log( `${testStr} =>\n${strip.combining( testStr )}` );
// Rügen caractères spéciaux contrairement à la langue française =>
// Rugen caracteres speciaux contrairement a la langue francaise
```
Note that `precomposed()` and `combining()` switches default functions:
```js
console.log( `${testStr} =>\n${strip.remove_diacritics( testStr )}` );
// Rügen caractères spéciaux contrairement à la langue française =>
// Rugen caracteres speciaux contrairement a la langue francaise

strip.precomposed();

console.log( `${testStr} =>\n${strip.remove_diacritics( testStr )}` );
// Rügen caractères spéciaux contrairement à la langue française =>
// Rügen caracteres speciaux contrairement a la langue francaise
```
In addition, some utility functions are included that might be useful for various searches, especially typeaheads.
```js
const simpleStr = `42 caractères spéciaux!`;

console.log( `keep letters only: ${strip.letters_only( simpleStr )}` );
// caracteres speciaux

console.log( `keep letters and numbers only: ${strip.alphanum_only( simpleStr )}` );
// 42 caracteres speciaux

console.log( `packed letters only: ${strip.packed( simpleStr )}` );
// caracteresspeciaux

console.log( `packed letters and numbers only: ${strip.packed_alphanum( simpleStr )}` );
// 42caracteresspeciaux
```

[coveralls-image]: https://coveralls.io/repos/github/julianjensen/yads/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/julianjensen/yads?branch=master

[travis-url]: https://travis-ci.org/julianjensen/yads
[travis-image]: http://img.shields.io/travis/julianjensen/yads.svg
