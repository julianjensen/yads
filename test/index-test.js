"use strict";

const
    dia = require( '../index' ),
    expect = require( 'chai' ).expect,
    comboStr = "Rügen",
    testStr = "caractères spéciaux contrairement à la langue française",
    folded = "caracteres speciaux contrairement a la langue francaise",
    short = "42 caractères spéciaux!";

describe( 'diacritics', () => {

    it( 'should fold precomposed characters', () => {
        expect( dia.precomposed( testStr ) ).to.equal( folded );
        expect( dia.precomposed( comboStr ) ).to.not.equal( "Rugen" );
    } );

    it( 'should fold combining diacritics', () => {
        expect( dia.combining( testStr ) ).to.equal( folded );
        expect( dia.combining( comboStr ) ).to.equal( "Rugen" );
    } );

    it( 'should switch the default removal function', () => {
        expect( dia.precomposed( testStr ) ).to.equal( folded );
        expect( dia.remove_diacritics( comboStr ) ).to.equal( comboStr );
        expect( dia.combining( testStr ) ).to.equal( folded );
        expect( dia.remove_diacritics( comboStr ) ).to.equal( "Rugen" );
    } );

    it( 'should do some assorted packing', () => {
        expect( dia.letters( short ) ).to.equal( " caracteres speciaux" );
        expect( dia.alphanum( short ) ).to.equal( "42 caracteres speciaux" );
        expect( dia.packed( short ) ).to.equal( "caracteresspeciaux" );
        expect( dia.packed_alphanum( short ) ).to.equal( "42caracteresspeciaux" );
    } );
} );
