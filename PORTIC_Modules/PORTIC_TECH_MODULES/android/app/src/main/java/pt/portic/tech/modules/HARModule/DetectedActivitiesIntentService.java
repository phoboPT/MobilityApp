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

    @SuppressWarnings("unchecked")
    @Override
    protected void onHandleIntent(Intent intent) {
        ActivityRecognitionResult result = ActivityRecognitionResult.extractResult(intent);

        // Get the list of the probable activities associated with the current state of the
        // device. Each activity is associated with a confidence level, which is an int between
        // 0 and 100.
        ArrayList<DetectedActivity> detectedActivities = (ArrayList) result.getProbableActivities();

        for (DetectedActivity activity : detectedActivities) {
            Log.e(TAGs, "Detected activity: " + activity.getType() + ": " +
                    DetectedActivityGetType(activity.getType()) + ", " +
                    activity.getConfidence() + "%.");

            /**
             * Save record in database
             *
             * private String userID;
             * private java.sql.Timestamp timestamp;
             * private int activityType;
             * private String activityDescription;
             * private int confidence;
             */
            RealmDataBaseManager.getInstance().AddDataToDB(UserProfileManager.getInstance().Get_User_ID(),
                    (new java.sql.Timestamp(Calendar.getInstance().getTime().getTime())).toString(),
                    activity.getType(),
                    DetectedActivityGetType(activity.getType()),
                    activity.getConfidence());


            /**
             * use this to convert String back to sql.Timestamp
             * https://stackoverflow.com/questions/7628103/convert-java-string-to-sql-timestamp
             */
            broadcastActivity(activity);
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
    private void broadcastActivity(DetectedActivity activity) {
        Intent intent = new Intent(HARModuleManager.BROADCAST_DETECTED_ACTIVITY);
        intent.putExtra("type", activity.getType());
        intent.putExtra("confidence", activity.getConfidence());
        LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
    }
}
