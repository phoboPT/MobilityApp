package pt.portic.tech.modules;

/**
 *  Software disponibilizado no âmbito do projeto TECH pelo PORTIC, Instituto Politécnico do Porto.
 *
 *  Os direitos de autor são exclusivamente retidos pelo PORTIC, e qualquer partilha
 *  deste código carece de autorização explicita por parte do autor responsável.
 *
 *  Autor:      Dr.Eng. Francisco Xavier dos Santos Fonseca
 *  Nº Ordem:   84598
 *  Data:       2021.Nov.10
 *  Email:      xavier.fonseca@portic.ipp.pt
 */

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import pt.portic.tech.modules.HARModule.HARModuleManager;
import pt.portic.tech.modules.UserProfile.UserProfileManager;


/**
 *
 * This file imports the native module you created, e.g., HAR_Module. It then instantiates
 * HAR_Module within the createNativeModules() function and returns it as a list of NativeModules
 * to register.
 */
public class All_Modules_Into_React_Native_Package implements ReactPackage {


    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {

        List<NativeModule> modules = new ArrayList<>();
        // Register the encryption module
        modules.add(new HARModuleManager());
        modules.add(new UserProfileManager());

        return modules;
    }

}
