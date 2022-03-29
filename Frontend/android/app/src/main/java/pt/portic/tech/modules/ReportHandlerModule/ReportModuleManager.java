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
 *  Data:           2021.Dec.10
 *  Email
 *  Institucional:  xavier.fonseca@portic.ipp.pt
 */
package pt.portic.tech.modules.ReportHandlerModule;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Calendar;

import pt.portic.tech.modules.HARModule.HARModuleManager;
import pt.portic.tech.modules.Public_API_ReportManager_Module;

public class ReportModuleManager extends ReactContextBaseJavaModule implements Public_API_ReportManager_Module {
    private static final String TAG = "ReportModuleManager";

    static AppCompatActivity activity;
    public AlarmManager alarmManager;
    public PendingIntent pendingIntent;
    public static Calendar calendar = null;
    public static int hour = 20, minute = 00,second = 00;

    private static ReportModuleManager reportModuleManagerSingleton =null;
    public ReportModuleManager() {activity = HARModuleManager.mainActivityObj;    }
    public ReportModuleManager(AppCompatActivity activityObj) {activity = activityObj;    }

    public static ReportModuleManager getInstance(){
        if (reportModuleManagerSingleton == null){
            synchronized(ReportModuleManager.class){
                if (reportModuleManagerSingleton == null){
                    //instance will be created at request time
                    reportModuleManagerSingleton = new ReportModuleManager();
                }
            }
        }

        return reportModuleManagerSingleton;
    }
    public static ReportModuleManager getInstance(AppCompatActivity activityObj){
        if (reportModuleManagerSingleton == null){
            synchronized(ReportModuleManager.class){
                if (reportModuleManagerSingleton == null){
                    //instance will be created at request time
                    reportModuleManagerSingleton = new ReportModuleManager(activityObj);
                }
            }
        }

        return reportModuleManagerSingleton;
    }


    @NonNull
    @Override
    public String getName() {
        return "ReportModuleManager";
    }

    /********************************************************************************
     ***************************** Módulo Report Manager ****************************
     ************ para criação dos relatórios de atividade do utilizador ************
     *
     * Este módulo estará responsável por caracterizar o movimento do utilizador, uma
     * vez por dia, e por produzir um relatório com esta informação, a ser armazenado
     * numa base de dados.
     *
     *
     *******************************************************************************/
    /**
     * MUST ONLY BE CALLED WHEN APPLICATION IS IN FOREGROUND. This is not a service intent,
     * and therefore the context will be null when app gets killed.
     */
    @Override
    public void Begin_Report_Handler_Module() {

        alarmManager = (AlarmManager) activity.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(activity, ReportAlarm.class);
        intent.setAction(ReportAlarm.ACTION_ALARM_RECEIVER);//my custom string action name
        pendingIntent = PendingIntent.getBroadcast(activity, 1001, intent, PendingIntent.FLAG_CANCEL_CURRENT); // was activity, 0, intent, 0

        calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, hour); // For 1 PM or 2 PM
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, second);

        alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), AlarmManager.INTERVAL_DAY, pendingIntent);
        //alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, System.currentTimeMillis(), AlarmManager.INTERVAL_DAY, pendingIntent); //first start will start asap

        // Enable ReportAlarm Component
        //setBootReceiverEnabled(PackageManager.COMPONENT_ENABLED_STATE_ENABLED);
        Log.d(TAG, "Report Handler module alarm is set every day at " +hour+":"+minute+":"+second+"H.");
    }

    /**
     * MUST ONLY BE CALLED WHEN APPLICATION IS IN FOREGROUND. This is not a service intent,
     * and therefore the context will be null when app gets killed.
     */
    
    @Override
    public void Stop_Report_Handler_Module() {
        //cancelAlarm();
        /*if (alarmManager != null) {
            alarmManager.cancel(pendingIntent);
            pendingIntent.cancel();//important
            // Disable ReportAlarm Component
            //setBootReceiverEnabled(PackageManager.COMPONENT_ENABLED_STATE_DISABLED);
            alarmManager = null;
            Log.d(TAG, "Report Handler module alarm disabled.");
        }*/

        alarmManager = (AlarmManager) activity.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(activity, ReportAlarm.class);
        intent.setAction(ReportAlarm.ACTION_ALARM_RECEIVER);//my custom string action name
        pendingIntent = PendingIntent.getBroadcast(activity, 1001, intent, PendingIntent.FLAG_CANCEL_CURRENT); // was activity, 0, intent, 0

        alarmManager.cancel(pendingIntent);//important
        pendingIntent.cancel();//important

    }

    @ReactMethod
    @Override
    public String CalculateCurrentReport() {
        String report=new ReportAlarm().CalculateReport(HARModuleManager.mainActivityObj);
        Log.d("teste", "hey");
        Log.d("teste", report);
        return report;
    }

    /**
     * MUST ONLY BE CALLED WHEN APPLICATION IS IN FOREGROUND. This is not a service intent,
     * and therefore the context will be null when app gets killed.
     */
    @Override
    public void VerifyIfReportServiceIsRunning() {

        alarmManager = (AlarmManager) activity.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(activity, ReportAlarm.class);
        intent.setAction(ReportAlarm.ACTION_ALARM_RECEIVER);//my custom string action name

        boolean isWorking = (PendingIntent.getBroadcast(activity, 1001, intent, PendingIntent.FLAG_NO_CREATE) != null);//just changed the flag
        Log.d(TAG, "Report scheduler is " + (isWorking ? "" : "not") + " running...");

        if (!isWorking) {
            Begin_Report_Handler_Module();
            Log.d(TAG, "Restarting it!");
        }

    }
}
