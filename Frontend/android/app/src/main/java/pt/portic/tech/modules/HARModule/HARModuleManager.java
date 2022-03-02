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
package pt.portic.tech.modules.HARModule;

import android.app.ActivityManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.frontend.MainActivity;

import pt.portic.tech.modules.ActivityDB_Module.RealmDataBaseManager;
import pt.portic.tech.modules.HealthReportsDB_Module.HealthReportsDBManager;
import pt.portic.tech.modules.Public_API_HAR_Module;
import pt.portic.tech.modules.ReportHandlerModule.ReportModuleManager;
import pt.portic.tech.modules.UserProfile.UserProfileManager;

public class HARModuleManager extends ReactContextBaseJavaModule  implements Public_API_HAR_Module {

    /********************************************************************************
     *********************** Módulo Human Activity Recognition **********************
     ******************************* Implementation *********************************
     *******************************************************************************/
    public static AppCompatActivity mainActivityObj;
    private Intent harModuleServiceIntent = null;

    // hints para localização:
    // https://en.proft.me/2017/04/17/how-get-location-latitude-longitude-gps-android/

    public static final String BROADCAST_DETECTED_ACTIVITY = "activity_intent";
    public static final long DETECTION_INTERVAL_IN_MILLISECONDS = 1000;//1000; // 1 seg.
    public static final int CONFIDENCE = 75;
    public static final String PORTIC_Database_Name = "PORTIC_Health_Module_DB.realm";
    public static int sleepTimeA = 22, sleepTimeB = 9;// this is only in hours [22h-09] -> night time to ignore STILL time
    public static final int NUMBER_OF_DAYS_OF_WEEKLY_REPORT = 6; // (default: 6 [index 0 to 6 included] for 7 days)

    private static HARModuleManager harModuleManagerSingleton =null;
    public HARModuleManager() {

        // from REACT NATIVE main activity
        mainActivityObj = MainActivity.context;
        // if running from Android Frontend, change this line for the following
        //mainActivityObj = com.Frontend.MainActivity.context;
    }
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
        Log.d("HARModuleManager", "Requesting Human Activity Recognition background service to start.");
        Log.d("HARModuleManager", "The name of the person registered is: " + UserProfileManager.getInstance().Get_User_Name());

        //locationSetup();

        /***************************************************************
         *           Verify if you got Google Play Services
         * **************************************************************/
        int resultCode = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(mainActivityObj);
        switch (resultCode) {
            case ConnectionResult.SUCCESS:
                Log.d("HARModuleManager", "Google Play Services is ready to go!");
                break;
            default:
                Log.e("HARModuleManager", "Google Play Services does not exist!");
                showPlayServicesError(resultCode);
                return false;
        }


        if (harModuleServiceIntent == null) {
            //if (canGetLocation) {
            harModuleServiceIntent = new Intent(mainActivityObj,
                    BackgroundDetectedActivitiesService.class);


            // start Detected Activities DB to store the activities
            RealmDataBaseManager.getInstance().CreateDB(mainActivityObj);

            // start Health Reports DB to store the reports of the user's activity
            HealthReportsDBManager.getInstance().CreateDB(mainActivityObj);


            if (!isMyServiceRunning(BackgroundDetectedActivitiesService.class)) {
                mainActivityObj.startService(harModuleServiceIntent);
                Log.d("HARModuleManager", "Human Activity Recognition background service has begun.");
            }
        }

        ReportModuleManager.getInstance().Begin_Report_Handler_Module();
        //HealthReportsDBManager.getInstance().Begin_Health_Report_Handler_Module();


        return true;
    }

    private boolean isMyServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager)
                mainActivityObj.getSystemService(Context.ACTIVITY_SERVICE);

        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                Log.d ("HARModuleManager", service.service.getClassName() + " Service status Running");
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
        Log.d("HARModuleManager", "Requesting Human Activity Recognition background to stop.");

        if (harModuleServiceIntent != null) {
            mainActivityObj.stopService(harModuleServiceIntent);
            Log.d("HARModuleManager", "Human Activity Recognition background service has stopped.");

            harModuleServiceIntent = null;
        }

        //RealmDataBaseManager.getInstance().ReadAllDataFromDB();
        //if (locationManager != null) {
        //    locationManager.removeUpdates(this);
        //}
        ReportModuleManager.getInstance().Stop_Report_Handler_Module();
        //HealthReportsDBManager.getInstance().Stop_Health_Report_Handler_Module();

        return true;
    }
    
    /*
     * When Play Services is missing or at the wrong version, the client
     * library will assist with a dialog to help the user update.
     */
    private void showPlayServicesError(int errorCode) {
        GoogleApiAvailability.getInstance().showErrorDialogFragment(mainActivityObj, errorCode, 10,
                new DialogInterface.OnCancelListener() {
                    @Override
                    public void onCancel(DialogInterface dialogInterface) {
                        mainActivityObj.finish();
                    }
                });
    }


    /**
     * Use this method to set up the night period [time A, time B]. This is to ignore
     * sedentary activities of type STILL when the user is likely to sleep. This does
     * not affect the recognition and logging of any other relevant activity (including
     * in vehicle, which is also sedentary).
     * Example, if set period is [22h, 09h], then all the STILL activities between 22h
     * and 09h will be ignored (not registered).
     *
     * @param timeA the beginning of the night period
     * @param timeB the end of the night period
     */
    @ReactMethod
    @Override
    public void SetNightTimePeriodToIgnoreActivity(int timeA, int timeB) {
        sleepTimeA = timeA;
        sleepTimeB = timeB;
    }
}
