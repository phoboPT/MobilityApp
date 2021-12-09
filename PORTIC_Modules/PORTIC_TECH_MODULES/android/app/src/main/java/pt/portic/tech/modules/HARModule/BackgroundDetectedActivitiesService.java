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

import android.annotation.TargetApi;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;
import android.os.SystemClock;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.google.android.gms.location.ActivityRecognition;
import com.google.android.gms.location.ActivityRecognitionClient;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.portic_tech_modules.R;

import java.util.HashSet;
import java.util.Set;

/**
 *
 * We need to create another background service class named
 * BackgroundDetectedActivitiesService.java which runs in background and triggers the
 * activities in an interval basis.
 *
 * https://www.androidhive.info/2017/12/android-user-activity-recognition-still-walking-running-driving-etc/
 */
public class BackgroundDetectedActivitiesService extends Service {

    private final String TAG = BackgroundDetectedActivitiesService.class.getSimpleName();

    private Intent mIntentService_DetectedActivities;//, mIntentService_LocationActivities;
    private PendingIntent mPendingIntent_DetectedActivities;//, mPendingIntent_LocationActivities;
    private ActivityRecognitionClient mActivityRecognitionClient;

    IBinder mBinder = new BackgroundDetectedActivitiesService.LocalBinder();

    public class LocalBinder extends Binder {
        public BackgroundDetectedActivitiesService getServerInstance() {
            return BackgroundDetectedActivitiesService.this;
        }
    }


    public BackgroundDetectedActivitiesService() {

    }

    private static Set<String> channels = new HashSet<>();


    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onCreate() {
        super.onCreate();
        mActivityRecognitionClient = new ActivityRecognitionClient(this);
        mIntentService_DetectedActivities = new Intent(this, DetectedActivitiesIntentService.class);
        mPendingIntent_DetectedActivities = PendingIntent.getService(this,
                0, mIntentService_DetectedActivities,
                PendingIntent.FLAG_UPDATE_CURRENT);

        String channel = "AMaaS";
        NotificationChannel chan = null;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createChannelIfNeeded(channel);

            chan = new NotificationChannel(channel, channel, NotificationManager.IMPORTANCE_LOW);
            chan.setLightColor(Color.BLUE);
            chan.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
        }

        NotificationManager notificationManager = (NotificationManager) getSystemService(this.NOTIFICATION_SERVICE);
        assert notificationManager != null;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            notificationManager.createNotificationChannel(chan);
        }


        NotificationCompat.Builder builderServiceAMaaS = new NotificationCompat.Builder(this, channel);
        builderServiceAMaaS.setContentIntent(mPendingIntent_DetectedActivities)
                .setAutoCancel(false)
                .setOngoing(true)
                .setContentTitle(getText(R.string.notification_titleAMaaS))
                .setContentText(getText(R.string.notification_messageAMaaS))
                .setSmallIcon(R.drawable.com_facebook_button_like_background)
                .setPriority(NotificationManager.IMPORTANCE_LOW)
                .setCategory(Notification.CATEGORY_SERVICE)
                .setColor(Color.BLUE)
                //.setTicker(getText(R.string.ticker_text))
                .setChannelId("AMaaS");

        //NotificationCompat.Builder builderServiceLocation = new NotificationCompat.Builder(this, channel);
        //builderServiceLocation.setContentIntent(mPendingIntent_LocationActivities)
        //      .setAutoCancel(false)
        //      .setOngoing(true)
        //      .setContentTitle(getText(R.string.notification_titleLocation))
        //      .setContentText(getText(R.string.notification_messageLocation))
        //      .setSmallIcon(R.drawable.com_facebook_button_like_background)
        //      .setPriority(NotificationManager.IMPORTANCE_LOW)
        //      .setCategory(Notification.CATEGORY_SERVICE)
        //      .setColor(Color.BLUE)
                //.setTicker(getText(R.string.ticker_text))
        //      .setChannelId("Location");


        Notification notificationAMaaS = builderServiceAMaaS.build();
        //Notification notificationLocation = builderServiceLocation.build();
        notificationManager.notify(1, notificationAMaaS);
        //notificationManager.notify(2, notificationLocation);
        startForeground(1, notificationAMaaS);
        //startForeground(2, notificationLocation);
    }

    @TargetApi(24)
    private static void createChannelIfNeeded(String identifier) {
        if (channels.contains(identifier))
            return;
        channels.add(identifier);

    }



    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        super.onStartCommand(intent, flags, startId);

        // start my service
        requestActivityUpdatesButtonHandler();

        return START_STICKY;
    }

    /*
    public void requestActivityUpdatesButtonHandler() {
        List<ActivityTransition> transitions = new ArrayList<>();

        transitions.add(
                new ActivityTransition.Builder()
                        .setActivityType(DetectedActivity.IN_VEHICLE)
                        .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
                        .build());
        transitions.add(
                new ActivityTransition.Builder()
                        .setActivityType(DetectedActivity.IN_VEHICLE)
                        .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
                        .build());
        transitions.add(
                new ActivityTransition.Builder()
                        .setActivityType(DetectedActivity.WALKING)
                        .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
                        .build());
        transitions.add(
                new ActivityTransition.Builder()
                        .setActivityType(DetectedActivity.WALKING)
                        .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
                        .build());
        transitions.add(
                new ActivityTransition.Builder()
                        .setActivityType(DetectedActivity.ON_BICYCLE)
                        .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
                        .build());
        transitions.add(
                new ActivityTransition.Builder()
                        .setActivityType(DetectedActivity.ON_BICYCLE)
                        .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
                        .build());
        transitions.add(
                new ActivityTransition.Builder()
                        .setActivityType(DetectedActivity.RUNNING)
                        .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
                        .build());
        transitions.add(
                new ActivityTransition.Builder()
                        .setActivityType(DetectedActivity.RUNNING)
                        .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
                        .build());
        transitions.add(
                new ActivityTransition.Builder()
                        .setActivityType(DetectedActivity.STILL)
                        .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
                        .build());
        transitions.add(
                new ActivityTransition.Builder()
                        .setActivityType(DetectedActivity.STILL)
                        .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
                        .build());


        ActivityTransitionRequest request = new ActivityTransitionRequest(transitions);
        Task<Void> task = ActivityRecognition.getClient(this)
                .requestActivityTransitionUpdates(request, mPendingIntent);

        task.addOnSuccessListener(
                new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void result) {
                        Log.d("BackgroundDetecASModule","Successfully requested activity updates");
                        Toast.makeText(getApplicationContext(),
                                "AMaaS activity sensing is ON.",
                                Toast.LENGTH_SHORT)
                                .show();
                    }
                }
        );

        task.addOnFailureListener(
                new OnFailureListener() {
                    @Override
                    public void onFailure(Exception e) {
                        Log.d("BackgroundDetecASModule","Requesting activity updates failed to start because: " + e.toString());
                        Toast.makeText(getApplicationContext(),
                                "AMaaS activity sensing failed to start.",
                                Toast.LENGTH_SHORT)
                                .show();
                    }
                }
        );
    }*/


    public void requestActivityUpdatesButtonHandler() {
        //Log.d("BackgroundDetecASModule","requestActivityUpdatesButtonHandler started.");
        Task<Void> taskAMaaS = mActivityRecognitionClient.requestActivityUpdates(
                HARModuleManager.DETECTION_INTERVAL_IN_MILLISECONDS,
                mPendingIntent_DetectedActivities);

        //Task<Void> taskLocation = mActivityRecognitionClient.requestActivityUpdates(
        //      HARModuleManager.DETECTION_INTERVAL_IN_MILLISECONDS,
        //      mPendingIntent_LocationActivities);

        taskAMaaS.addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void result) {
                Log.d("BackgroundDetecASModule","Successfully requested activity updates");
                Toast.makeText(getApplicationContext(),
                        "AMaaS activity sensing is ON.",
                        Toast.LENGTH_SHORT)
                        .show();
            }
        });
        /*
        taskLocation.addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void result) {
                Log.d("BackgroundDetecASModule","Successfully requested Location updates");
                Toast.makeText(getApplicationContext(),
                        "Location is ON.",
                        Toast.LENGTH_SHORT)
                        .show();
            }
        });*/

        taskAMaaS.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                Log.d("BackgroundDetecASModule","Requesting activity updates failed to start");
                Toast.makeText(getApplicationContext(),
                        "AMaaS activity sensing failed to start.",
                        Toast.LENGTH_SHORT)
                        .show();
            }
        });
        /*taskLocation.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                Log.d("BackgroundDetecASModule","Requesting location updates failed to start");
                Toast.makeText(getApplicationContext(),
                        "Location awareness failed to start.",
                        Toast.LENGTH_SHORT)
                        .show();
            }
        });*/
    }

    public void removeActivityUpdatesButtonHandler() {
        Task<Void> taskAMaaS = ActivityRecognition.getClient(this)
                .removeActivityTransitionUpdates(mPendingIntent_DetectedActivities);
        //Task<Void> taskLocation = ActivityRecognition.getClient(this)
        //        .removeActivityTransitionUpdates(mPendingIntent_LocationActivities);


        taskAMaaS.addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void result) {
                Toast.makeText(getApplicationContext(),
                        "AMaaS activity sensing is OFF.",
                        Toast.LENGTH_SHORT)
                        .show();
                mPendingIntent_DetectedActivities.cancel();
            }
        });
        /*taskLocation.addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void result) {
                Toast.makeText(getApplicationContext(),
                        "Location awareness is OFF.",
                        Toast.LENGTH_SHORT)
                        .show();
                mPendingIntent_LocationActivities.cancel();
            }
        });*/

        taskAMaaS.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                Toast.makeText(getApplicationContext(), "Failed to remove activity updates!",
                        Toast.LENGTH_SHORT).show();
                Log.e("MYCOMPONENT", e.getMessage());
            }
        });
        /*taskLocation.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                Toast.makeText(getApplicationContext(), "Failed to remove activity updates!",
                        Toast.LENGTH_SHORT).show();
                Log.e("MYCOMPONENT", e.getMessage());
            }
        });*/
    }


    @Override
    public void onDestroy() {
        //super.onDestroy();
        Log.d("BackgroundDetecASModule", "onDestroy()");

        removeActivityUpdatesButtonHandler();

        /*Intent broadcastIntent = new Intent();
        broadcastIntent.setAction("Restart_AMaaS_Service");
        broadcastIntent.setClass(this, BackgroundServicesRestarter.class);
        //broadcastIntent.setClass(this, DetectedActivitiesIntentService.class);
        this.sendBroadcast(broadcastIntent); */

        super.onDestroy();
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public void onTaskRemoved(Intent rootIntent){
        Log.d("BackgroundDetecASModule", "onTaskRemoved()");

        Intent restartServiceIntent = new Intent(this, BackgroundDetectedActivitiesService.class);
        restartServiceIntent.setPackage(getPackageName());
// ActivityManager manager = (ActivityManager)
//                mainActivityObj.getSystemService(Context.ACTIVITY_SERVICE);
        PendingIntent restartServicePendingIntent = PendingIntent.getService(getApplicationContext(), 1, restartServiceIntent, PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE);
        AlarmManager alarmService = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
        alarmService.set(
                AlarmManager.ELAPSED_REALTIME,
                SystemClock.elapsedRealtime() + 500,
                restartServicePendingIntent);

        super.onTaskRemoved(rootIntent);
    }
}