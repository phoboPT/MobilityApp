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

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

import io.realm.Realm;
import pt.portic.tech.modules.ActivityDB_Module.ActivitiesDataModal;

public class ReportAlarm extends BroadcastReceiver {
    private static final String TAG = "ReportAlarmModule";
    Realm realm = null;

    /**
     *  ***********************************************************
     *              Report Handler Algorithm
     *  ***********************************************************
     *
     *  Unknown activities are ignored.
     *  TILT activities are dependent on the previously meaningful
     *  activity. (it's as if it had the previous label).
     *
     *  Sedentary activities are put together -> Still, in vehicle
     *
     *  Physical activities are put together -> on bicycle, walking, on foot, running
     *
     *  Gets executed once a day. Timer scheduled in the "ReportModuleManager" class
     */
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "Where you produce your report!");

        List<ActivitiesDataModal> records = getDBActivityRecords(context);
        java.sql.Timestamp timestamp1 = null,timestamp2 = null;
        /*
            private long id;
            private String userID;
            private String timestamp;
            private int activityType;
            private String activityDescription;
            private int confidence;
            private double latitude;
            private double longitude;

            case 0: "IN_VEHICLE";
            case 1: "ON_BICYCLE";
            case 2: "ON_FOOT";
            case 3: "STILL";
            case 4: "UNKNOWN";
            case 5: "TILTING";
            case 7: "WALKING";
            case 8: "RUNNING";
        */


        // ignored
        // case 4: "UNKNOWN";

        // capture sedentary activity
        // case 0: "IN_VEHICLE";
        // case 3: "STILL";
        // handle special case 5: "TILTING";
        boolean previous_case_is_still = false;
        long stillMillisecondsTotal = 0;
        int seconds = 0;
        int minutes = 0;
        int hours = 0;
        for (ActivitiesDataModal record : records) {
            if ((record.getActivityType() == 3) ||
                    ((record.getActivityType() == 5) && previous_case_is_still))
            {
                // if its first DB record, I cannot calculate time differences and add them together
                if (!previous_case_is_still)
                {
                    timestamp1 = java.sql.Timestamp.valueOf(record.getTimestamp());
                }
                else {
                    timestamp2 = java.sql.Timestamp.valueOf(record.getTimestamp());

                    stillMillisecondsTotal = stillMillisecondsTotal + timestamp2.getTime() - timestamp1.getTime();




                    // shifts cursor to current record, in case there's another one to sum to this
                    timestamp1 = timestamp2;
                }

                previous_case_is_still = true;
            }
            // if this is an unknown record, simply ignore, may be a glitch
            else if (record.getActivityType() == 4) {}
            // anything else means its a different type of activity, so does not add
            else {previous_case_is_still = false;}
        }
        Log.d(TAG, "Amount of time Still:");
        seconds = (int) stillMillisecondsTotal / 1000;
        hours = seconds / 3600;
        minutes = (seconds % 3600) / 60;
        seconds = (seconds % 3600) % 60;
        Log.d(TAG, " Hours: " + hours);
        Log.d(TAG, " Minutes: " + minutes);
        Log.d(TAG, " Seconds: " + seconds);



        // capture activity
        //  case 1: "ON_BICYCLE";
        //  case 2: "ON_FOOT";
        //  case 7: "WALKING";
        //  case 8: "RUNNING";
        // handle special case 5: "TILTING";

        closeDB();
        previous_case_is_still = false;
        Toast.makeText(context, "AMaaS: Daily Report Available.", Toast.LENGTH_LONG).show(); // For example
    }


    private List<ActivitiesDataModal> getDBActivityRecords(Context context) {
        /*
        Realm.init(context);

        RealmConfiguration config =
                new RealmConfiguration.Builder()
                        .name("DetectedActivities.db")
                        // below line is to allow write
                        // data to database on ui thread.
                        .allowWritesOnUiThread(true)
                        // below line is to delete realm
                        // if migration is needed.
                        .deleteRealmIfMigrationNeeded()
                        // at last we are calling a method to build.
                        .build();
        // on below line we are setting
        // configuration to our realm database.
        Realm.setDefaultConfiguration(config);*/

        realm = Realm.getDefaultInstance();
        List<ActivitiesDataModal> modals = new ArrayList<ActivitiesDataModal>();

        // on below line we are getting data from realm database in our list.
        modals = realm.where(ActivitiesDataModal.class).findAll();

        return modals;
    }

    private void closeDB() {realm.close();}
}
