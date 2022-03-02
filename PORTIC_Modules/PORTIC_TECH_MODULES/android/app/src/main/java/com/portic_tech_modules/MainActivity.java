package com.portic_tech_modules;

/**
 *  Grupo ESMAPP. Atividade principal do Frontend.
 *
 *  Autor:
 *  Data:       2021.Nov.10
 *  Email:
 */

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import com.facebook.react.ReactActivity;

import pt.portic.tech.modules.HARModule.HARModuleManager;
import pt.portic.tech.modules.ReportHandlerModule.ReportModuleManager;

// when to integrate with React Native, uncomment this Main Activity

public class MainActivity extends ReactActivity {

  // Returns the name of the main component registered from JavaScript. This is used to schedule
  //rendering of the component.

  public static AppCompatActivity context;

  public MainActivity() {
    /**
     * Place used to initiate background services needed by the application.
     * Responsibility: PORTIC/IPP
     */

    context = this;
    HARModuleManager.getInstance(context);
    ReportModuleManager.getInstance(context);

  }


  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);


    //ReportModuleManager.getInstance().alarmManager = (AlarmManager) this.getSystemService(Context.ALARM_SERVICE);
    //Intent intent = new Intent(this, MainActivity.class);
    //ReportModuleManager.getInstance().pendingIntent = PendingIntent.getActivity(this, 0, intent, 0);


  }

  @Override
  protected String getMainComponentName() {
    return "PORTIC_TECH_MODULES";
  }
}
