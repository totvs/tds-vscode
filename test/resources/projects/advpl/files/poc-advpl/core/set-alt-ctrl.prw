#include "protheus.ch"

/*/{Protheus.doc} setAltKeys
Associates action with the activation of Alt-?.

@type function
@author acandido
@since 09/09/2025
/*/
user function setAltKeys(aoTarget, aoEvents)
	setKey( K_ALT_A, { || logKey("K_ALT_A", aoTarget, aoEvents)})
	setKey( K_ALT_B, { || logKey("K_ALT_B", aoTarget, aoEvents)})
	setKey( K_ALT_C, { || logKey("K_ALT_C", aoTarget, aoEvents)})
	setKey( K_ALT_D, { || logKey("K_ALT_D", aoTarget, aoEvents)})
	setKey( K_ALT_E, { || logKey("K_ALT_E", aoTarget, aoEvents)})
	setKey( K_ALT_F, { || logKey("K_ALT_F", aoTarget, aoEvents)})
	setKey( K_ALT_G, { || logKey("K_ALT_G", aoTarget, aoEvents)})
	setKey( K_ALT_H, { || logKey("K_ALT_H", aoTarget, aoEvents)})
	setKey( K_ALT_I, { || logKey("K_ALT_I", aoTarget, aoEvents)})
	setKey( K_ALT_J, { || logKey("K_ALT_J", aoTarget, aoEvents)})
	setKey( K_ALT_K, { || logKey("K_ALT_K", aoTarget, aoEvents)})
	setKey( K_ALT_L, { || logKey("K_ALT_L", aoTarget, aoEvents)})
	setKey( K_ALT_M, { || logKey("K_ALT_M", aoTarget, aoEvents)})
	setKey( K_ALT_N, { || logKey("K_ALT_N", aoTarget, aoEvents)})
	setKey( K_ALT_O, { || logKey("K_ALT_O", aoTarget, aoEvents)})
	setKey( K_ALT_P, { || logKey("K_ALT_P", aoTarget, aoEvents)})
	setKey( K_ALT_Q, { || logKey("K_ALT_Q", aoTarget, aoEvents)})
	setKey( K_ALT_R, { || logKey("K_ALT_R", aoTarget, aoEvents)})
	setKey( K_ALT_S, { || logKey("K_ALT_S", aoTarget, aoEvents)})
	setKey( K_ALT_T, { || logKey("K_ALT_T", aoTarget, aoEvents)})
	setKey( K_ALT_U, { || logKey("K_ALT_U", aoTarget, aoEvents)})
	setKey( K_ALT_V, { || logKey("K_ALT_V", aoTarget, aoEvents)})
	setKey( K_ALT_W, { || logKey("K_ALT_W", aoTarget, aoEvents)})
	setKey( K_ALT_X, { || logKey("K_ALT_X", aoTarget, aoEvents)})
	setKey( K_ALT_Y, { || logKey("K_ALT_Y", aoTarget, aoEvents)})
	setKey( K_ALT_Z, { || logKey("K_ALT_Z", aoTarget, aoEvents)})

return

/*/{Protheus.doc} setCtrlKeys
Associates action with the activation of Ctrl-?.

@type function
@author acandido
@since 09/09/2025
/*/
user function setCtrlKeys(aoTarget, aoEvents)
	setKey( K_CTRL_A, { || logKey("K_CTRL_A", aoTarget, aoEvents)})
	setKey( K_CTRL_B, { || logKey("K_CTRL_B", aoTarget, aoEvents)})
	setKey( K_CTRL_C, { || logKey("K_CTRL_C", aoTarget, aoEvents)})
	setKey( K_CTRL_D, { || logKey("K_CTRL_D", aoTarget, aoEvents)})
	setKey( K_CTRL_E, { || logKey("K_CTRL_E", aoTarget, aoEvents)})
	setKey( K_CTRL_F, { || logKey("K_CTRL_F", aoTarget, aoEvents)})
	setKey( K_CTRL_G, { || logKey("K_CTRL_G", aoTarget, aoEvents)})
	setKey( K_CTRL_H, { || logKey("K_CTRL_H", aoTarget, aoEvents)})
	setKey( K_CTRL_I, { || logKey("K_CTRL_I", aoTarget, aoEvents)})
	setKey( K_CTRL_J, { || logKey("K_CTRL_J", aoTarget, aoEvents)})
	setKey( K_CTRL_K, { || logKey("K_CTRL_K", aoTarget, aoEvents)})
	setKey( K_CTRL_L, { || logKey("K_CTRL_L", aoTarget, aoEvents)})
	setKey( K_CTRL_M, { || logKey("K_CTRL_M", aoTarget, aoEvents)})
	setKey( K_CTRL_N, { || logKey("K_CTRL_N", aoTarget, aoEvents)})
	setKey( K_CTRL_O, { || logKey("K_CTRL_O", aoTarget, aoEvents)})
	setKey( K_CTRL_P, { || logKey("K_CTRL_P", aoTarget, aoEvents)})
	setKey( K_CTRL_Q, { || logKey("K_CTRL_Q", aoTarget, aoEvents)})
	setKey( K_CTRL_R, { || logKey("K_CTRL_R", aoTarget, aoEvents)})
	setKey( K_CTRL_S, { || logKey("K_CTRL_S", aoTarget, aoEvents)})
	setKey( K_CTRL_T, { || logKey("K_CTRL_T", aoTarget, aoEvents)})
	setKey( K_CTRL_U, { || logKey("K_CTRL_U", aoTarget, aoEvents)})
	setKey( K_CTRL_V, { || logKey("K_CTRL_V", aoTarget, aoEvents)})
	setKey( K_CTRL_W, { || logKey("K_CTRL_W", aoTarget, aoEvents)})
	setKey( K_CTRL_X, { || logKey("K_CTRL_X", aoTarget, aoEvents)})
	setKey( K_CTRL_Y, { || logKey("K_CTRL_Y", aoTarget, aoEvents)})
	setKey( K_CTRL_Z, { || logKey("K_CTRL_Z", aoTarget, aoEvents)})
	setKey( K_CTRL_1, { || logKey("K_CTRL_1", aoTarget, aoEvents)})
	setKey( K_CTRL_2, { || logKey("K_CTRL_2", aoTarget, aoEvents)})
	setKey( K_CTRL_3, { || logKey("K_CTRL_3", aoTarget, aoEvents)})
	setKey( K_CTRL_4, { || logKey("K_CTRL_4", aoTarget, aoEvents)})
	setKey( K_CTRL_5, { || logKey("K_CTRL_5", aoTarget, aoEvents)})
	setKey( K_CTRL_6, { || logKey("K_CTRL_6", aoTarget, aoEvents)})
	setKey( K_CTRL_7, { || logKey("K_CTRL_7", aoTarget, aoEvents)})
	setKey( K_CTRL_8, { || logKey("K_CTRL_8", aoTarget, aoEvents)})
	setKey( K_CTRL_9, { || logKey("K_CTRL_9", aoTarget, aoEvents)})
	setKey( K_CTRL_0, { || logKey("K_CTRL_0", aoTarget, aoEvents)})
	setKey( K_CTRL_KEYPAD_1, { || logKey("K_CTRL_KEYPAD_1", aoTarget, aoEvents)})
	setKey( K_CTRL_KEYPAD_2, { || logKey("K_CTRL_KEYPAD_2", aoTarget, aoEvents)})
	setKey( K_CTRL_KEYPAD_3, { || logKey("K_CTRL_KEYPAD_3", aoTarget, aoEvents)})
	setKey( K_CTRL_KEYPAD_4, { || logKey("K_CTRL_KEYPAD_4", aoTarget, aoEvents)})
	setKey( K_CTRL_KEYPAD_5, { || logKey("K_CTRL_KEYPAD_5", aoTarget, aoEvents)})
	setKey( K_CTRL_KEYPAD_6, { || logKey("K_CTRL_KEYPAD_6", aoTarget, aoEvents)})
	setKey( K_CTRL_KEYPAD_7, { || logKey("K_CTRL_KEYPAD_7", aoTarget, aoEvents)})
	setKey( K_CTRL_KEYPAD_8, { || logKey("K_CTRL_KEYPAD_8", aoTarget, aoEvents)})
	setKey( K_CTRL_KEYPAD_9, { || logKey("K_CTRL_KEYPAD_9", aoTarget, aoEvents)})
	setKey( K_CTRL_KEYPAD_0, { || logKey("K_CTRL_KEYPAD_0", aoTarget, aoEvents)})
	setKey( K_CTRL_LEFT, { || logKey("K_CTRL_LEFT", aoTarget, aoEvents)})
	setKey( K_CTRL_UP, { || logKey("K_CTRL_UP", aoTarget, aoEvents)})
	setKey( K_CTRL_RIGHT, { || logKey("K_CTRL_RIGHT", aoTarget, aoEvents)})
	setKey( K_CTRL_DOWN, { || logKey("K_CTRL_DOWN", aoTarget, aoEvents)})
	setKey( K_CTRL_KEYPAD_LEFT, { || logKey("K_CTRL_KEYPAD_LEFT", aoTarget, aoEvents)})
	setKey( K_CTRL_KEYPAD_UP, { || logKey("K_CTRL_KEYPAD_UP", aoTarget, aoEvents)})
	setKey( K_CTRL_KEYPAD_RIGHT, { || logKey("K_CTRL_KEYPAD_RIGHT", aoTarget, aoEvents)})
	setKey( K_CTRL_KEYPAD_DOWN, { || logKey("K_CTRL_KEYPAD_DOWN", aoTarget, aoEvents)})

return

/*/{Protheus.doc} setFnKeys
Associates action with the activation of functions keys.

@type function
@author acandido
@since 09/09/2025
/*/
user function setFnKeys(aoTarget, aoEvents)
	setKey( VK_F1, { || logKey("VK_F1", aoTarget, aoEvents)})
	setKey( VK_F2, { || logKey("VK_F2", aoTarget, aoEvents)})
	setKey( VK_F3, { || logKey("VK_F3", aoTarget, aoEvents)})
	setKey( VK_F4, { || logKey("VK_F4", aoTarget, aoEvents)})
	setKey( VK_F5, { || logKey("VK_F5", aoTarget, aoEvents)})
	setKey( VK_F6, { || logKey("VK_F6", aoTarget, aoEvents)})
	setKey( VK_F7, { || logKey("VK_F7", aoTarget, aoEvents)})
	setKey( VK_F8, { || logKey("VK_F8", aoTarget, aoEvents)})
	setKey( VK_F9, { || logKey("VK_F9", aoTarget, aoEvents)})
	setKey( VK_F10, { || logKey("VK_F10", aoTarget, aoEvents)})
	setKey( VK_F11, { || logKey("VK_F11", aoTarget, aoEvents)})
	setKey( VK_F12, { || logKey("VK_F12", aoTarget, aoEvents)})
	setKey( VK_F13, { || logKey("VK_F13", aoTarget, aoEvents)})
	setKey( VK_F14, { || logKey("VK_F14", aoTarget, aoEvents)})
	setKey( VK_F15, { || logKey("VK_F15", aoTarget, aoEvents)})
	setKey( VK_F16, { || logKey("VK_F16", aoTarget, aoEvents)})
	setKey( VK_F17, { || logKey("VK_F17", aoTarget, aoEvents)})
	setKey( VK_F18, { || logKey("VK_F18", aoTarget, aoEvents)})
	setKey( VK_F19, { || logKey("VK_F19", aoTarget, aoEvents)})
	setKey( VK_F20, { || logKey("VK_F20", aoTarget, aoEvents)})
	setKey( VK_F21, { || logKey("VK_F21", aoTarget, aoEvents)})
	setKey( VK_F22, { || logKey("VK_F22", aoTarget, aoEvents)})
	setKey( VK_F23, { || logKey("VK_F23", aoTarget, aoEvents)})
	setKey( VK_F24, { || logKey("VK_F24", aoTarget, aoEvents)})

	setKey( K_SH_F1, { || logKey("K_SHIFT_F1", aoTarget, aoEvents)})
	setKey( K_SH_F2, { || logKey("K_SHIFT_F2", aoTarget, aoEvents)})
	setKey( K_SH_F3, { || logKey("K_SHIFT_F3", aoTarget, aoEvents)})
	setKey( K_SH_F4, { || logKey("K_SHIFT_F4", aoTarget, aoEvents)})
	setKey( K_SH_F5, { || logKey("K_SHIFT_F5", aoTarget, aoEvents)})
	setKey( K_SH_F6, { || logKey("K_SHIFT_F6", aoTarget, aoEvents)})
	setKey( K_SH_F7, { || logKey("K_SHIFT_F7", aoTarget, aoEvents)})
	setKey( K_SH_F8, { || logKey("K_SHIFT_F8", aoTarget, aoEvents)})
	setKey( K_SH_F9, { || logKey("K_SHIFT_F9", aoTarget, aoEvents)})
	setKey( K_SH_F10, { || logKey("K_SHIFT_F10", aoTarget, aoEvents)})
	setKey( K_SH_F11, { || logKey("K_SHIFT_F11", aoTarget, aoEvents)})
	setKey( K_SH_F12, { || logKey("K_SHIFT_F12", aoTarget, aoEvents)})

	setKey( K_CTRL_F1, { || logKey("K_CTRL_F1", aoTarget, aoEvents)})
	setKey( K_CTRL_F2, { || logKey("K_CTRL_F2", aoTarget, aoEvents)})
	setKey( K_CTRL_F3, { || logKey("K_CTRL_F3", aoTarget, aoEvents)})
	//Fecha a página
	//setKey( K_CTRL_F4, { || logKey("K_CTRL_F4", aoTarget, aoEvents)})
	setKey( K_CTRL_F5, { || logKey("K_CTRL_F5", aoTarget, aoEvents)})
	setKey( K_CTRL_F6, { || logKey("K_CTRL_F6", aoTarget, aoEvents)})
	setKey( K_CTRL_F7, { || logKey("K_CTRL_F7", aoTarget, aoEvents)})
	setKey( K_CTRL_F8, { || logKey("K_CTRL_F8", aoTarget, aoEvents)})
	setKey( K_CTRL_F9, { || logKey("K_CTRL_F9", aoTarget, aoEvents)})
	setKey( K_CTRL_F10, { || logKey("K_CTRL_F10", aoTarget, aoEvents)})
	setKey( K_CTRL_F11, { || logKey("K_CTRL_F11", aoTarget, aoEvents)})
	setKey( K_CTRL_F12, { || logKey("K_CTRL_F12", aoTarget, aoEvents)})

	setKey( K_ALT_F1, { || logKey("K_ALT_F1", aoTarget, aoEvents)})
	setKey( K_ALT_F2, { || logKey("K_ALT_F2", aoTarget, aoEvents)})
	setKey( K_ALT_F3, { || logKey("K_ALT_F3", aoTarget, aoEvents)})
	setKey( K_ALT_F4, { || logKey("K_ALT_F4", aoTarget, aoEvents)})
	setKey( K_ALT_F5, { || logKey("K_ALT_F5", aoTarget, aoEvents)})
	setKey( K_ALT_F6, { || logKey("K_ALT_F6", aoTarget, aoEvents)})
	setKey( K_ALT_F7, { || logKey("K_ALT_F7", aoTarget, aoEvents)})
	setKey( K_ALT_F8, { || logKey("K_ALT_F8", aoTarget, aoEvents)})
	setKey( K_ALT_F9, { || logKey("K_ALT_F9", aoTarget, aoEvents)})
	setKey( K_ALT_F10, { || logKey("K_ALT_F10", aoTarget, aoEvents)})
	setKey( K_ALT_F11, { || logKey("K_ALT_F11", aoTarget, aoEvents)})
	setKey( K_ALT_F12, { || logKey("K_ALT_F12", aoTarget, aoEvents)})

return

/*/{Protheus.doc} setOthersKeys
Associates action with the activation of others keys.

@type function
@author acandido
@since 09/09/2025
/*/
user function setOthersKeys(aoTarget, aoEvents)
	setKey( VK_NUMLOCK, { || logKey("VK_NUMLOCK", aoTarget, aoEvents)})
	setKey( VK_SCROLL, { || logKey("VK_SCROLL", aoTarget, aoEvents)})
	setKey( K_CTRL_UNDERSCORE, { || logKey("K_CTRL_UNDERSCORE", aoTarget, aoEvents)})
	setKey( K_CTRL_EQUAL, { || logKey("K_CTRL_EQUAL", aoTarget, aoEvents)})
return

static function logKey(acWho, aoTarget, aoEvents)
	local cValue := eval(aoTarget:bSetGet)

	u_firedEvent(aoEvents, acWho + ": " + cValue)
	u_remoteLog("triggered: ["+acWho+"] " + cValue)

return
