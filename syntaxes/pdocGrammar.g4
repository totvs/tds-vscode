/**
 * Copyright 2022 - TOTVS S/A - All Rights Reserved
 
 Grammar for ProtheusDOC.
 
 @author
 * acandido@totvs.com.br
 
 @version 1.0
 
 */
parser grammar pdocGrammar;

options {
	tokenVocab = pdocLexer;
}

@parser::header {

}

start: NEWLINE* (protheusDoc)*;

protheusDoc:
	(CL_PROTHEUS_DOC_START | PROTHEUS_DOC_START) PDOC_ID? PDOC_NEWLINE+ (
		proDocBaseDescription
	)? (proDocElementsOrErrors)* PROTHEUS_DOC_END;

//////////////////////////////////////////////////////
// PROTHEUSDOC

proDocElementsOrErrors:
	(proDocElements PDOC_NEWLINE*)	# expectedStatement
	| multiLineValue				# unexpectedStatement;

proDocElements:
	(
		proDocAuthor
		| proDocAccessLevel
		| proDocBuild
		| proDocChildren
		| proDocCountry
		| proDocDatabase
		| proDocParam
		| proDocDescription
		| proDocDeprecated
		| proDocExample
		| proDocLanguage
		| proDocLink
		| proDocObs
		| proDocParents
		| proDocProtected
		| proDocReturn
		| proDocSystemOper
		| proDocSee
		| proDocSince
		| proDocTable
		| proDocTodo
		| proDocVersion
		| proDocType
		| proDocPropType
		| proDocDefValue
		| proDocReadOnly
		| proDocSource
		| proDocHistory
		| proDocProject
		| proDocOwner
		| proDocMenu
		| proDocIssue
		| proDocUnknown ///obrigatório ser a última
	);

proDocBaseDescription: multiLineValue;

proDocAuthor: AT_AUTHOR expPdocValue?;

proDocAccessLevel: AT_ACCESSLEVEL expPdocValue?;

proDocBuild: AT_BUILD expPdocValue?;

proDocChildren: AT_CHILDREN multiLineValue?;

proDocCountry: AT_COUNTRY expPdocValue?;

proDocDatabase: AT_DATABASE expPdocValue?;

proDocParam: AT_PARAM multiLineValue?;

proDocDescription: AT_DESCRIPTION multiLineValue?;

proDocDeprecated: AT_DEPRECATED expPdocValue?;

proDocExample: ( AT_EXAMPLE | AT_SAMPLE) multiLineValue?;

proDocLanguage: AT_LANGUAGE expPdocValue?;

proDocLink: AT_LINK expPdocValue?;

proDocObs: AT_OBS multiLineValue?;

proDocParents: AT_PARENTS multiLineValue?;

proDocProtected: AT_PROTECTED expPdocValue?;

proDocReturn: AT_RETURN PDOC_ID? expPdocValue?;

proDocSystemOper: AT_SYSTEMOPER expPdocValue?;

proDocSee: AT_SEE multiLineValue?;

proDocSince: AT_SINCE expPdocValue?;

proDocTable:
	AT_TABLE (
		(
			PDOC_ID (
				PDOC_NEWLINE? PDOC_COMMA PDOC_NEWLINE? PDOC_ID
			)*
		)
		| expPdocValue
	)?;

proDocTodo: AT_TODO multiLineValue?;

proDocVersion: AT_VERSION expPdocValue?;

proDocType: functionModifiers? AT_TYPE expPdocValue?;

proDocPropType: AT_PROPTYPE expPdocValue?;

proDocDefValue: AT_DEFVALUE expPdocValue?;

proDocReadOnly: AT_READONLY expPdocValue?;

proDocSource: AT_SOURCE expPdocValue?;

proDocHistory: AT_HISTORY expPdocValue?;

proDocProject: AT_PROJECT expPdocValue?;

proDocOwner: AT_OWNER expPdocValue?;

proDocMenu: AT_MENU expPdocValue?;

proDocIssue: AT_ISSUE expPdocValue?;

proDocUnknown: AT_UNKNOWN expPdocValue?;

expPdocValue: ~( PDOC_NEWLINE)+;

functionModifiers:
	STATIC
	| MAIN
	| USER
	| WEB
	| TEMPLATE
	| HTML
	| PROJECT;

multiLineValue:
	~(
		AT_ACCESSLEVEL
		| AT_AUTHOR
		| AT_BUILD
		| AT_CHILDREN
		| AT_COUNTRY
		| AT_DATABASE
		| AT_DESCRIPTION
		| AT_DEPRECATED
		| AT_EXAMPLE
		| AT_HISTORY
		| AT_SAMPLE
		| AT_LANGUAGE
		| AT_LINK
		| AT_OBS
		| AT_PARAM
		| AT_PARENTS
		| AT_PROTECTED
		| AT_TYPE
		| AT_PROPTYPE
		| AT_DEFVALUE
		| AT_READONLY
		| AT_SOURCE
		| AT_RETURN
		| AT_SYSTEMOPER
		| AT_SEE
		| AT_SINCE
		| AT_TABLE
		| AT_TODO
		| AT_VERSION
		| PROTHEUS_DOC_END
		| PROTHEUS_DOC_END_4GL
	)+;
