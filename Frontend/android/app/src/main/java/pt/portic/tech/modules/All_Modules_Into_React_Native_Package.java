/**
 *  Software disponibilizado no âmbito do projeto TECH pelo PORTIC, Instituto Politécnico do Porto.
 *
 *  Os direitos de autor são exclusivamente retidos pelo PORTIC e pelo Autor mencionado nesta nota.
 *  Carece de autorização explicita por parte do autor responsável o uso deste código (1) para fins
 *  que não sejam devidamente definidos na Licença que acompanha este projeto, e (2) para os fins que
 *  própria licença assim o exija.
 *
 *  Autor:          Dr.Eng. Francisco Xavier dos Santos Fonseca
 *  Nº da Ordem:    84598
 *  Data:           2021.Nov.10
 *  Email
 *  Institucional:  xavier.fonseca@portic.ipp.pt
 */
package pt.portic.tech.modules;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import pt.portic.tech.modules.ActivityDB_Module.RealmDataBaseManager;
import pt.portic.tech.modules.HARModule.HARModuleManager;
import pt.portic.tech.modules.HealthReportsDB_Module.HealthReportsDBManager;
import pt.portic.tech.modules.ReportHandlerModule.ReportModuleManager;
import pt.portic.tech.modules.UserProfile.UserProfileManager;
import pt.portic.tech.modules.RecommendationsModule.RecommendationsManager;


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
        // Register all the modules to be exposed to React Native
        modules.add(new HARModuleManager());
        modules.add(new UserProfileManager());
        modules.add(new RealmDataBaseManager());
        modules.add(new ReportModuleManager());
        modules.add(new HealthReportsDBManager());
        modules.add(new RecommendationsManager());

        return modules;
    }

}
