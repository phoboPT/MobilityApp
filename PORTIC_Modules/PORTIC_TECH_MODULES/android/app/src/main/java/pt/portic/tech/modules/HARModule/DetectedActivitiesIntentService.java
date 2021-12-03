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

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.google.android.gms.location.ActivityRecognitionResult;
import com.google.android.gms.location.DetectedActivity;

import java.util.ArrayList;
import java.util.Calendar;

import pt.portic.tech.modules.ActivityDB_Module.RealmDataBaseManager;
import pt.portic.tech.modules.UserProfile.UserProfileManager;

/**
 * Google API:
 * https://developers.google.com/android/reference/com/google/android/gms/location/DetectedActivity
 *
 * Followed Example:
 * https://www.androidhive.info/2017/12/android-user-activity-recognition-still-walking-running-driving-etc/
 */
public class DetectedActivitiesIntentService extends IntentService {

    //protected final String TAGs = DetectedActivitiesIntentService.class.getSimpleName();
    protected String TAGs;

    public DetectedActivitiesIntentService() {
        // Use the TAG to name the worker thread.
        super(DetectedActivitiesIntentService.class.getSimpleName());
        TAGs = DetectedActivitiesIntentService.class.getSimpleName();

    }

    @Override
    public void onCreate() {
        super.onCreate();
    }

    /*
    @SuppressWarnings("unchecked")
    @Override
    protected void onHandleIntent(Intent intent) {
        if (ActivityTransitionResult.hasResult(intent)) {
            ActivityTransitionResult result = ActivityTransitionResult.extractResult(intent);

            // pode ser null. faz o check disto
            ActivitiesDataModal m = RealmDataBaseManager.getInstance().ReadLastRecordFromDB();

            for (ActivityTransitionEvent event : result.getTransitionEvents()) {
                // chronological sequence of events....
                Log.e(TAGs, "Detected activity: " + event.getActivityType() + ": " +
                        DetectedActivityGetType(event.getActivityType()) + ", type: " +
                        event.getTransitionType());

                Toast.makeText(getApplicationContext(),
                        "Detected activity: " + event.getActivityType() + ": " +
                                DetectedActivityGetType(event.getActivityType()) + ", type: " +
                                event.getTransitionType(),
                        Toast.LENGTH_SHORT)
                        .show();


                if (m != null)
                {
                    if ((m.getActivityType() == event.getActivityType()) && (m.getConfidence() == event.getTransitionType())) {
                        // ignore, I don't want a damn crowded database everytime this fires up.
                    }
                    else
                    {
                        java.sql.Timestamp timestamp = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
                        RealmDataBaseManager.getInstance().AddDataToDB(UserProfileManager.getInstance().Get_User_ID(),
                                (timestamp).toString(),
                                event.getActivityType(),
                                DetectedActivityGetType(event.getActivityType()),
                                event.getTransitionType());
                    }
                }
                else
                {
                    java.sql.Timestamp timestamp = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
                    RealmDataBaseManager.getInstance().AddDataToDB(UserProfileManager.getInstance().Get_User_ID(),
                            (timestamp).toString(),
                            event.getActivityType(),
                            DetectedActivityGetType(event.getActivityType()),
                            event.getTransitionType());
                }
            }
        }
    }*/


    protected void onHandleIntent(Intent intent) {
        ActivityRecognitionResult result = ActivityRecognitionResult.extractResult(intent);

        // Get the list of the probable activities associated with the current state of the
        // device. Each activity is associated with a confidence level, which is an int between
        // 0 and 100.
        try {
            ArrayList<DetectedActivity> detectedActivities = (ArrayList) result.getProbableActivities();

            for (DetectedActivity activity : detectedActivities) {
                Log.e(TAGs, "Detected activity: " + activity.getType() + ": " +
                        DetectedActivityGetType(activity.getType()) + ", " +
                        activity.getConfidence() + "%.");

                java.sql.Timestamp timestamp = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
                if (activity.getConfidence() >= HARModuleManager.CONFIDENCE) {
                    RealmDataBaseManager.getInstance().AddDataToDB(UserProfileManager.getInstance().Get_User_ID(),
                            (timestamp).toString(),
                            activity.getType(),
                            DetectedActivityGetType(activity.getType()),
                            activity.getConfidence());
                }


            }
        }catch(java.lang.NullPointerException e){
            Log.e("DetectedActIntentServ", "Erro: " + e.toString());
        }
    }

    private String DetectedActivityGetType(int type) {
        switch (type) {
            case 0: return "IN_VEHICLE";
            case 1: return "ON_BICYCLE";
            case 2: return "ON_FOOT";
            case 3: return "STILL";
            case 4: return "UNKNOWN";
            case 5: return "TILTING";
            case 7: return "WALKING";
            case 8: return "RUNNING";
            default: return "UNKNOWN";
        }
    }

    // In onHandleIntent() method, list of probable activities will be retried and broadcasted
    // using LocalBroadcastManager.
    private void broadcastActivity(DetectedActivity activity, java.sql.Timestamp timestamp) {
        Intent intent = new Intent(HARModuleManager.BROADCAST_DETECTED_ACTIVITY);
        intent.putExtra("userID", UserProfileManager.getInstance().Get_User_ID());
        intent.putExtra("type", activity.getType());
        intent.putExtra("description", DetectedActivityGetType(activity.getType()));
        intent.putExtra("confidence", activity.getConfidence());
        intent.putExtra("timestamp", timestamp);
        LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
    }

    @Override
    public void onDestroy() {
        //super.onDestroy();
        Log.d("DetectedActIntentServ", "onDestroy()");

        Intent broadcastIntent = new Intent();
        broadcastIntent.setAction("Restart_AMaaS_Service");
        broadcastIntent.setClass(this, AMaaSServiceRestarter.class);
        //broadcastIntent.setClass(this, DetectedActivitiesIntentService.class);
        this.sendBroadcast(broadcastIntent);

        super.onDestroy();
    }
}
