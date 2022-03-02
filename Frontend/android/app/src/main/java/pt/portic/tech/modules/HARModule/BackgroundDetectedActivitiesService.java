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
import com.frontend.R;

import java.util.HashSet;
import java.util.Set;

import pt.portic.tech.modules.ReportHandlerModule.ReportModuleManager;

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

        Notification notificationAMaaS = builderServiceAMaaS.build();
        notificationManager.notify(1, notificationAMaaS);
        startForeground(1, notificationAMaaS);

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


    public void requestActivityUpdatesButtonHandler() {
        Task<Void> taskAMaaS = mActivityRecognitionClient.requestActivityUpdates(
                HARModuleManager.DETECTION_INTERVAL_IN_MILLISECONDS,
                mPendingIntent_DetectedActivities);


        taskAMaaS.addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void result) {
                Log.d("BackgroundDetecASModule","Successfully requested activity updates");
                ReportModuleManager.getInstance().VerifyIfReportServiceIsRunning();

                /*Toast.makeText(getApplicationContext(),
                        "AMaaS activity sensing is ON.",
                        Toast.LENGTH_SHORT)
                        .show();*/
            }
        });

        taskAMaaS.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                
                Log.d("BackgroundDetecASModule","Requesting activity updates failed to start");
                  Toast.makeText(getApplicationContext(),
                       e.getMessage(),
                        Toast.LENGTH_SHORT)
                        .show();
                Toast.makeText(getApplicationContext(),
                        "AMaaS activity sensing failed to start.",
                        Toast.LENGTH_SHORT)
                        .show();
            }
        });
    }

    public void removeActivityUpdatesButtonHandler() {
        Task<Void> taskAMaaS = ActivityRecognition.getClient(this)
                .removeActivityTransitionUpdates(mPendingIntent_DetectedActivities);

        taskAMaaS.addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void result) {
                /*Toast.makeText(getApplicationContext(),
                        "AMaaS activity sensing is OFF.",
                        Toast.LENGTH_SHORT)
                        .show();*/
                mPendingIntent_DetectedActivities.cancel();
                ReportModuleManager.getInstance().Stop_Report_Handler_Module();
            }
        });

        taskAMaaS.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                Toast.makeText(getApplicationContext(), "Failed to remove activity updates!",
                        Toast.LENGTH_SHORT).show();
                Log.e("MYCOMPONENT", e.getMessage());
            }
        });
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

        PendingIntent restartServicePendingIntent = PendingIntent.getService(getApplicationContext(), 1, restartServiceIntent, PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE);
        AlarmManager alarmService = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
        alarmService.set(
                AlarmManager.ELAPSED_REALTIME,
                SystemClock.elapsedRealtime() + 500,
                restartServicePendingIntent);

        super.onTaskRemoved(rootIntent);
    }
}