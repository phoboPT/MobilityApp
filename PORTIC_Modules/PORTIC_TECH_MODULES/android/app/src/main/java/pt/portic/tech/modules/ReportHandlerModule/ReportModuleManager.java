/**
 *  Software disponibilizado no âmbito do projeto TECH pelo PORTIC, Instituto Politécnico do Porto.
 *
 *  Os direitos de autor são exclusivamente retidos pelo PORTIC, e qualquer partilha
 *  deste código carece de autorização explicita por parte do autor responsável.
 *
 *  Autor:      Dr.Eng. Francisco Xavier dos Santos Fonseca
 *  Nº Ordem:   84598
 *  Data:       2021.Dez.10
 *  Email:      xavier.fonseca@portic.ipp.pt
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
    public static int hour = 18,minute = 30,second = 00;

    private static ReportModuleManager reportModuleManagerSingleton =null;
    public ReportModuleManager() {
        activity = HARModuleManager.mainActivityObj;

        /*
        ReportModuleManager.getInstance().alarmManager = (AlarmManager) activity.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(activity, MainActivity.class);
        ReportModuleManager.getInstance().pendingIntent = PendingIntent.getActivity(activity, 0, intent, 0);

        calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, hour); // For 1 PM or 2 PM
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, second);*/
    }
    public ReportModuleManager(AppCompatActivity activityObj) {
        activity = activityObj;
/*
        ReportModuleManager.getInstance().alarmManager = (AlarmManager) activity.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(activity, MainActivity.class);
        ReportModuleManager.getInstance().pendingIntent = PendingIntent.getActivity(activity, 0, intent, 0);

        calendar = Calendar.getInstance();

        calendar.set(Calendar.HOUR_OF_DAY, hour); // For 1 PM or 2 PM
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, second);*/
    }
    public static ReportModuleManager getInstance(){
        if (reportModuleManagerSingleton == null){
            synchronized(ReportModuleManager.class){
                if (reportModuleManagerSingleton == null){
                    reportModuleManagerSingleton = new ReportModuleManager();//instance will be created at request time
                    /*calendar = Calendar.getInstance();
                    calendar.set(Calendar.HOUR_OF_DAY, hour); // For 1 PM or 2 PM
                    calendar.set(Calendar.MINUTE, minute);
                    calendar.set(Calendar.SECOND, second);*/
                }
            }
        }

        return reportModuleManagerSingleton;
    }
    public static ReportModuleManager getInstance(AppCompatActivity activityObj){
        if (reportModuleManagerSingleton == null){
            synchronized(ReportModuleManager.class){
                if (reportModuleManagerSingleton == null){
                    reportModuleManagerSingleton = new ReportModuleManager(activityObj);//instance will be created at request time
                    /*calendar = Calendar.getInstance();
                    calendar.set(Calendar.HOUR_OF_DAY, hour); // For 1 PM or 2 PM
                    calendar.set(Calendar.MINUTE, minute);
                    calendar.set(Calendar.SECOND, second);*/
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
    @ReactMethod
    @Override
    public void Begin_Report_Handler_Module() {

        alarmManager = (AlarmManager) activity.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(activity, ReportAlarm.class);
        pendingIntent = PendingIntent.getBroadcast(activity, 0, intent, 0);



        Calendar rightNow = Calendar.getInstance();
        if (rightNow.get(Calendar.MINUTE) < 59) {
            minute = rightNow.get(Calendar.MINUTE) + 1;
            hour = rightNow.get(Calendar.HOUR_OF_DAY); // return the hour in 24 hrs format (ranging from 0-23)
        }
        else {
            minute = 00;
            if (rightNow.get(Calendar.HOUR_OF_DAY) < 23) {
                hour = rightNow.get(Calendar.HOUR_OF_DAY) + 1; // return the hour in 24 hrs format (ranging from 0-23)
            }
            else hour = 00; // return the hour in 24 hrs format (ranging from 0-23)
        }

        calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, hour); // For 1 PM or 2 PM
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, second);

        //setAlarm();// AlarmManager.INTERVAL_DAY
        alarmManager.setRepeating(AlarmManager.RTC, calendar.getTimeInMillis(), 60 * 1000, pendingIntent);

        // Enable ReportAlarm Component
        //setBootReceiverEnabled(PackageManager.COMPONENT_ENABLED_STATE_ENABLED);
        Log.d(TAG, "Report Handler module alarm is set.");
    }
    @ReactMethod
    @Override
    public void Stop_Report_Handler_Module() {
        //cancelAlarm();
        if (alarmManager != null) {
            alarmManager.cancel(pendingIntent);
            // Disable ReportAlarm Component
            //setBootReceiverEnabled(PackageManager.COMPONENT_ENABLED_STATE_DISABLED);
            Log.d(TAG, "Report Handler module alarm disabled.");
        }
    }
    /*private void setAlarm() {
        Log.d(TAG, "AlarmReceiver set");
        alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, System.currentTimeMillis(), 1000 * 60, pendingIntent);

        // Enable ReportAlarm Component
        setBootReceiverEnabled(PackageManager.COMPONENT_ENABLED_STATE_ENABLED);
    }
    private void cancelAlarm() {
        Log.d(TAG, "AlarmReceiver cancelled");
        alarmManager.cancel(pendingIntent);

        // Disable ReportAlarm Component
        setBootReceiverEnabled(PackageManager.COMPONENT_ENABLED_STATE_DISABLED);
    }*/
    /*
    private void setBootReceiverEnabled(int componentEnabledState) {
        ComponentName componentName = new ComponentName(activity, ReportAlarm.class);
        PackageManager packageManager = activity.getPackageManager();
        packageManager.setComponentEnabledSetting(componentName,
                componentEnabledState,
                PackageManager.DONT_KILL_APP);
    }*/
}
