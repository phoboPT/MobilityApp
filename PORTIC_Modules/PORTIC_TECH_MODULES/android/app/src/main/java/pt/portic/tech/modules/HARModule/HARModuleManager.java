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

package pt.portic.tech.modules.HARModule;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import pt.portic.tech.modules.ActivityDB_Module.RealmDataBaseManager;
import pt.portic.tech.modules.Public_API_HAR_Module;
import pt.portic.tech.modules.UserProfile.UserProfileManager;

public class HARModuleManager extends ReactContextBaseJavaModule implements Public_API_HAR_Module {

    /********************************************************************************
     *********************** Módulo Human Activity Recognition **********************
     ******************************* Implementation *********************************
     *******************************************************************************/
    public static AppCompatActivity mainActivityObj;
    private Intent harModuleServiceIntent = null;

    public static final String BROADCAST_DETECTED_ACTIVITY = "activity_intent";
    public static final long DETECTION_INTERVAL_IN_MILLISECONDS = 1000; // 1 seg.
    public static final int CONFIDENCE = 75;

    private static HARModuleManager harModuleManagerSingleton =new HARModuleManager();
    public HARModuleManager() {    }
    public HARModuleManager(AppCompatActivity activityObj) {
        mainActivityObj = activityObj;
    }
    public static HARModuleManager getInstance(){
        if (harModuleManagerSingleton == null){
            synchronized(HARModuleManager.class){
                if (harModuleManagerSingleton == null){
                    harModuleManagerSingleton = new HARModuleManager();//instance will be created at request time
                }
            }
        }

        return harModuleManagerSingleton;
    }
    public static HARModuleManager getInstance(AppCompatActivity activityObj){
        if (harModuleManagerSingleton == null){
            synchronized(HARModuleManager.class){
                if (harModuleManagerSingleton == null){
                    harModuleManagerSingleton = new HARModuleManager(activityObj);//instance will be created at request time
                }
            }
        }

        return harModuleManagerSingleton;
    }


    // All Java native modules in Android need to implement the getName() method. This method
    // returns a string, which represents the name of the native module. The native module can
    // then be accessed in JavaScript using its name.
    @NonNull
    @Override
    public String getName() {
        return "HAR_Module";
    }

    /**
     * Begin recognizing human activity.
     * All native module methods meant to be invoked from JavaScript must be annotated
     * with @ReactMethod.
     *
     * @return true (success) | false (failure in request)
     */
    @ReactMethod
    @Override
    public boolean HAR_Begin_Service() {
        Log.d("HAR_Module", "Requesting Human Activity Recognition background service to start.");
        Log.d("HAR_Module", "The name of the person registered is: " + UserProfileManager.getInstance().Get_User_Name());

        if (harModuleServiceIntent == null) {
            harModuleServiceIntent = new Intent(mainActivityObj,
                    BackgroundDetectedActivitiesService.class);

            // start Detected Activities DB to store the activities
            RealmDataBaseManager.getInstance().CreateDB(mainActivityObj);


            if (!isMyServiceRunning(BackgroundDetectedActivitiesService.class)) {
                mainActivityObj.startService(harModuleServiceIntent);
                Log.d("HAR_Module", "Human Activity Recognition background service has begun.");
            }
        }

        return true;
    }

    private boolean isMyServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager)
                mainActivityObj.getSystemService(Context.ACTIVITY_SERVICE);

        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                Log.d ("HARModuleManager", "AMaaS Service status Running");
                return true;
            }
        }
        Log.d ("HARModuleManager", "AMaaS Service status Not running");
        return false;
    }

    /**
     * Stop recognizing human activity
     * All native module methods meant to be invoked from JavaScript must be annotated
     * with @ReactMethod.
     *
     * @return true (success) | false (failure in request)
     */
    @ReactMethod
    @Override
    public boolean HAR_Stop_Service(){
        Log.d("HAR_Module", "Requesting Human Activity Recognition background to stop.");

        if (harModuleServiceIntent != null) {
            mainActivityObj.stopService(harModuleServiceIntent);
            Log.d("HAR_Module", "Human Activity Recognition background service has stopped.");
            harModuleServiceIntent = null;
        }

//        RealmDataBaseManager.getInstance().ReadAllDataFromDB();

        return true;
    }



}
