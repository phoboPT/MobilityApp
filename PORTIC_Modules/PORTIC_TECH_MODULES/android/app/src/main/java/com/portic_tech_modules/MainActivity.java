package com.portic_tech_modules;

/**
 *  Grupo ESMAPP. Atividade principal do Frontend.
 *
 *  Autor:
 *  Data:       2021.Nov.10
 *  Email:
 */

import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.ReactActivity;

import pt.portic.tech.modules.HARModule.HARModuleManager;

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
  }

  @Override
  protected String getMainComponentName() {
    return "PORTIC_TECH_MODULES";
  }
}
