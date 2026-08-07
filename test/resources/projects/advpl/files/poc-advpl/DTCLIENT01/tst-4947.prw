#include 'protheus.ch'

//Transpar�ncia com RGBA 0.3 � ignorada e sempre retorna 0
//https://jiraproducao.totvs.com.br/browse/DTCLIENT01-4947
User Function tst4947()
	local aOption := {;
		{"Default", { |aoParent| createDlg(aoParent, "")} },;
		{"Solid (0)", { |aoParent| createDlg(aoParent, "0 10px 10px rgb(255, 255, 0);")} },;
		{"Transparency (0.3)", { |aoParent| createDlg(aoParent, "0 10px 10px rgba(255, 255, 0, 0.3);")} },;
		{"With Blur (0)", { |aoParent| createDlg(aoParent, "10px 20px 30px rgb(255, 255, 0);")} },;
		{"With Blur and Transparency (0.30)", { |aoParent| createDlg(aoParent, "10px 20px 30px rgba(255, 255, 0, 0.3);")} },;
		{"With Int 128 (QT)", { |aoParent| createDlg(aoParent, "10px 20px 30px rgba(255, 255, 0, 128);")} },;
		{"With 50% (50%)", { |aoParent| createDlg(aoParent, "10px 20px 30px rgba(255, 255, 0, 50%);")} },;
		{"With 1", { |aoParent| createDlg(aoParent, "10px 20px 30px rgba(255, 255, 0, 1);")} },;
		{"With 100%", { |aoParent| createDlg(aoParent, "10px 20px 30px rgba(255, 255, 0, 100%);")} },;
		}

	u_selectTest("DTCLIENT01-4947", aOption)
return

static function createDlg(aoParent, acShadow)
	local oPanel
	local oDlg

	define dialog oDlg;
		title "Apply Shadow";
		from 180,180 to 550, 900;
		pixel;
		of aoParent

	@ 20, 20 mspanel oPanel;
		size 200, 150;
		raised ;
		of oDlg


	if !empty(acShadow)
		@ 020, 005 say "Apply the shadow: " + acShadow;
			of oPanel pixel
		oDlg:setCSS("QWidget { box-shadow: " + acShadow + ";}")
	else
		@ 020, 005 say "Apply the theme's default shadow";
			of oPanel pixel

	endif

	activate dialog oDlg center

return

