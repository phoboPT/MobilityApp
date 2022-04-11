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

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.ListIterator;
import java.util.concurrent.TimeUnit;

import io.realm.Realm;
import io.realm.RealmConfiguration;
import pt.portic.tech.modules.ActivityDB_Module.ActivitiesDataModal;
import pt.portic.tech.modules.HARModule.HARModuleManager;
import pt.portic.tech.modules.HealthReportsDB_Module.HealthReportsDBManager;
import pt.portic.tech.modules.UserProfile.UserProfileManager;

public class ReportAlarm extends BroadcastReceiver {
    private static final String TAG = "ReportAlarmModule";
    public static final String ACTION_ALARM_RECEIVER = "HealthReportsProducer";
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
        CalculateReport(context);
    }

    /**
            * Get a diff between two timestamps.
            *
            * @param oldTs The older timestamp
 * @param newTs The newer timestamp
 * @param timeUnit The unit in which you want the diff
 * @return The diff value, in the provided time unit.
 */
    public static long getDateDiff(java.sql.Timestamp oldTs, java.sql.Timestamp newTs, TimeUnit timeUnit) {
        long diffInMS = newTs.getTime() - oldTs.getTime();
        return timeUnit.convert(diffInMS, TimeUnit.MILLISECONDS);
    }

    public String CalculateReport(Context context) {
        Log.d(TAG, "Producing health report of the last day...");
        java.sql.Timestamp timestamp1 = null,timestamp2 = null;
        int seconds = 0;
        int minutes = 0;
        int hours = 0;
        String value="";


        java.sql.Timestamp timestampRightNow = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
        boolean timestampsUnder24h = true;

        /** *******************************************************
         * *************  Capture Sedentary Activity  **************
         * ******************************************************** */
        // capture sedentary activity
        // case 0: "IN_VEHICLE";
        // case 3: "STILL";

        List<ActivitiesDataModal> records = null;
        try {
            records = getDBActivityRecords(context);
        } catch (Exception e) {
            Log.e(TAG,"Could not CalculateReport. Exception: " + e.getMessage());
            e.printStackTrace();
        }
        ListIterator<ActivitiesDataModal> it = records.listIterator();

        boolean onFootActivityVector = false;
        List<Double> trackLats = new ArrayList<Double>();
        List<Double> trackLongs = new ArrayList<Double>();
        List<Long> timestampsTmp = new ArrayList<Long>();

        long stillMillisecondsTotal = 0,
                vehicleMillisecondsTotal = 0,
                bicycleMillisecondsTotal = 0,
                onfootMillisecondsTotal = 0,
                runningMillisecondsTotal = 0,
                tempoTotalDeAtividadeFisicaMilliseconds = 0,
                tempoTotalDeAtividadeSedentariaMilliseconds = 0;
        DispendioEnergetico gastoEnergeticoTotalOnFoot= new DispendioEnergetico(),
                gastoEnergeticoTotalOnBicycle= new DispendioEnergetico(),
                gastoEnergeticoTotalOnRunning= new DispendioEnergetico();

        while(it.hasNext())  {
            ActivitiesDataModal recordA = it.next();

            long diffHours = getDateDiff(java.sql.Timestamp.valueOf(recordA.getTimestamp()),
                    timestampRightNow, TimeUnit.HOURS);
            if (diffHours > 24) {timestampsUnder24h = false;}
            else {timestampsUnder24h = true;}

            //Log.d(TAG,""+java.sql.Timestamp.valueOf(recordA.getTimestamp())+
            //        " has a time difference of " + diffHours + " hours. Consider: " + timestampsUnder24h);

            if((it.hasNext()) && (timestampsUnder24h)) {
                ActivitiesDataModal recordB = it.next();
                it.previous();


                /** *******************************************************
                 * ***************  Sedentary Activities  *****************
                 * ******************************************************** */
                // case 0: "IN_VEHICLE";
                // case 3: "STILL";
                /** *******************************************************
                 * **********************  STILL  *************************
                 * ******************************************************** */
                if (recordA.getActivityType() == 3)
                {
                    timestamp1 = java.sql.Timestamp.valueOf(recordA.getTimestamp());
                    timestamp2 = java.sql.Timestamp.valueOf(recordB.getTimestamp());

                    stillMillisecondsTotal = stillMillisecondsTotal + timestamp2.getTime() - timestamp1.getTime();

                    if (onFootActivityVector) {
                        onFootActivityVector = false;
                        DispendioEnergetico gastoEnOnFootTmp =
                                EstimateMETsAndEffortFromWalkingVector(timestampsTmp, trackLats,trackLongs);
                        gastoEnergeticoTotalOnFoot.METsIntBaixa = gastoEnergeticoTotalOnFoot.METsIntBaixa + gastoEnOnFootTmp.METsIntBaixa;
                        gastoEnergeticoTotalOnFoot.METsIntModerada = gastoEnergeticoTotalOnFoot.METsIntModerada + gastoEnOnFootTmp.METsIntModerada;
                        gastoEnergeticoTotalOnFoot.METsIntVigorosa = gastoEnergeticoTotalOnFoot.METsIntVigorosa + gastoEnOnFootTmp.METsIntVigorosa;
                        gastoEnergeticoTotalOnFoot.distanceTravelled = gastoEnergeticoTotalOnFoot.distanceTravelled+ gastoEnOnFootTmp.distanceTravelled;
                        // reset walking track
                        trackLats = new ArrayList<Double>();
                        trackLongs = new ArrayList<Double>();
                        timestampsTmp = new ArrayList<Long>();
                    }
                }
                /** *******************************************************
                 * *******************  VEHICLE  **************************
                 * ******************************************************** */
                else if (recordA.getActivityType() == 0) {
                    timestamp1 = java.sql.Timestamp.valueOf(recordA.getTimestamp());
                    timestamp2 = java.sql.Timestamp.valueOf(recordB.getTimestamp());

                    vehicleMillisecondsTotal = vehicleMillisecondsTotal + timestamp2.getTime() - timestamp1.getTime();

                    if (onFootActivityVector) {
                        onFootActivityVector = false;
                        DispendioEnergetico gastoEnOnFootTmp =
                                EstimateMETsAndEffortFromWalkingVector(timestampsTmp, trackLats,trackLongs);
                        gastoEnergeticoTotalOnFoot.METsIntBaixa = gastoEnergeticoTotalOnFoot.METsIntBaixa + gastoEnOnFootTmp.METsIntBaixa;
                        gastoEnergeticoTotalOnFoot.METsIntModerada = gastoEnergeticoTotalOnFoot.METsIntModerada + gastoEnOnFootTmp.METsIntModerada;
                        gastoEnergeticoTotalOnFoot.METsIntVigorosa = gastoEnergeticoTotalOnFoot.METsIntVigorosa + gastoEnOnFootTmp.METsIntVigorosa;
                        gastoEnergeticoTotalOnFoot.distanceTravelled = gastoEnergeticoTotalOnFoot.distanceTravelled+ gastoEnOnFootTmp.distanceTravelled;
                        // reset walking track
                        trackLats = new ArrayList<Double>();
                        trackLongs = new ArrayList<Double>();
                        timestampsTmp = new ArrayList<Long>();
                    }
                }
                /** *******************************************************
                 * *************  Capture Active Physical Activity  *******
                 * ******************************************************** */
                // capture activity
                //  case 1: "ON_BICYCLE";
                //  case 2: "ON_FOOT";
                //  case 7: "WALKING";
                //  case 8: "RUNNING";
                /** *******************************************************
                 * *******************  ON BICYCLE  ***********************
                 * ******************************************************** */
                else if (recordA.getActivityType() == 1) {
                    timestamp1 = java.sql.Timestamp.valueOf(recordA.getTimestamp());
                    timestamp2 = java.sql.Timestamp.valueOf(recordB.getTimestamp());

                    bicycleMillisecondsTotal = bicycleMillisecondsTotal + timestamp2.getTime() - timestamp1.getTime();

                    DispendioEnergetico gastoEnOnbicycleTmp =
                            EstimateMETsAndEffort(2, timestamp1, timestamp2, recordA.getLatitude(), recordA.getLongitude(), recordB.getLatitude(), recordB.getLongitude());
                    gastoEnergeticoTotalOnBicycle.METsIntBaixa = gastoEnergeticoTotalOnBicycle.METsIntBaixa + gastoEnOnbicycleTmp.METsIntBaixa;
                    gastoEnergeticoTotalOnBicycle.METsIntModerada = gastoEnergeticoTotalOnBicycle.METsIntModerada + gastoEnOnbicycleTmp.METsIntModerada;
                    gastoEnergeticoTotalOnBicycle.METsIntVigorosa = gastoEnergeticoTotalOnBicycle.METsIntVigorosa + gastoEnOnbicycleTmp.METsIntVigorosa;
                    gastoEnergeticoTotalOnBicycle.distanceTravelled = gastoEnergeticoTotalOnBicycle.distanceTravelled + gastoEnOnbicycleTmp.distanceTravelled;

                    if (onFootActivityVector) {
                        onFootActivityVector = false;

                        DispendioEnergetico gastoEnOnFootTmp =
                        EstimateMETsAndEffortFromWalkingVector(timestampsTmp, trackLats,trackLongs);
                        gastoEnergeticoTotalOnFoot.METsIntBaixa = gastoEnergeticoTotalOnFoot.METsIntBaixa + gastoEnOnFootTmp.METsIntBaixa;
                        gastoEnergeticoTotalOnFoot.METsIntModerada = gastoEnergeticoTotalOnFoot.METsIntModerada + gastoEnOnFootTmp.METsIntModerada;
                        gastoEnergeticoTotalOnFoot.METsIntVigorosa = gastoEnergeticoTotalOnFoot.METsIntVigorosa + gastoEnOnFootTmp.METsIntVigorosa;
                        gastoEnergeticoTotalOnFoot.distanceTravelled = gastoEnergeticoTotalOnFoot.distanceTravelled+ gastoEnOnFootTmp.distanceTravelled;

                        // reset walking track
                        trackLats = new ArrayList<Double>();
                        trackLongs = new ArrayList<Double>();
                        timestampsTmp = new ArrayList<Long>();
                    }
                }
                /** *******************************************************
                 * *******************  ON FOOT/ WALKING  *****************
                 * ******************************************************** */
                else if ((recordA.getActivityType() == 2) || (recordA.getActivityType() == 7) ) {
                    // pattern detection, to correctly estimate amount of walking time. otherwise, it
                    // jumps too much and doesn't estimate correctly the METs, as records are under 1min
                    // in the DB.
                    // if very first time capturing this pattern
                    if (!onFootActivityVector) {
                        onFootActivityVector = true;
                    }

                    timestamp1 = java.sql.Timestamp.valueOf(recordA.getTimestamp());
                    timestamp2 = java.sql.Timestamp.valueOf(recordB.getTimestamp());

                    onfootMillisecondsTotal = onfootMillisecondsTotal + timestamp2.getTime() - timestamp1.getTime();
                    // onFootActivityVector, onFootActivityVectorMillisTmp, trackLats, trackLongs, timestampsTmp
                    trackLats.add(recordA.getLatitude());
                    trackLongs.add(recordA.getLongitude());
                    trackLats.add(recordB.getLatitude());
                    trackLongs.add(recordB.getLongitude());
                    timestampsTmp.add(timestamp2.getTime() - timestamp1.getTime());

                }
                /** *******************************************************
                 * ***********************  RUNNING  **********************
                 * ******************************************************** */
                else if (recordA.getActivityType() == 8) {
                    timestamp1 = java.sql.Timestamp.valueOf(recordA.getTimestamp());
                    timestamp2 = java.sql.Timestamp.valueOf(recordB.getTimestamp());

                    runningMillisecondsTotal = runningMillisecondsTotal + timestamp2.getTime() - timestamp1.getTime();

                    DispendioEnergetico gastoEnRunningTmp =
                            EstimateMETsAndEffort(2, timestamp1, timestamp2, recordA.getLatitude(), recordA.getLongitude(), recordB.getLatitude(), recordB.getLongitude());
                    gastoEnergeticoTotalOnRunning.METsIntBaixa = gastoEnergeticoTotalOnRunning.METsIntBaixa + gastoEnRunningTmp.METsIntBaixa;
                    gastoEnergeticoTotalOnRunning.METsIntModerada = gastoEnergeticoTotalOnRunning.METsIntModerada + gastoEnRunningTmp.METsIntModerada;
                    gastoEnergeticoTotalOnRunning.METsIntVigorosa = gastoEnergeticoTotalOnRunning.METsIntVigorosa + gastoEnRunningTmp.METsIntVigorosa;
                    gastoEnergeticoTotalOnRunning.distanceTravelled = gastoEnergeticoTotalOnRunning.distanceTravelled + gastoEnRunningTmp.distanceTravelled;

                    if (onFootActivityVector) {
                        onFootActivityVector = false;
                        DispendioEnergetico gastoEnOnFootTmp =
                                EstimateMETsAndEffortFromWalkingVector(timestampsTmp, trackLats,trackLongs);
                        gastoEnergeticoTotalOnFoot.METsIntBaixa = gastoEnergeticoTotalOnFoot.METsIntBaixa + gastoEnOnFootTmp.METsIntBaixa;
                        gastoEnergeticoTotalOnFoot.METsIntModerada = gastoEnergeticoTotalOnFoot.METsIntModerada + gastoEnOnFootTmp.METsIntModerada;
                        gastoEnergeticoTotalOnFoot.METsIntVigorosa = gastoEnergeticoTotalOnFoot.METsIntVigorosa + gastoEnOnFootTmp.METsIntVigorosa;
                        gastoEnergeticoTotalOnFoot.distanceTravelled = gastoEnergeticoTotalOnFoot.distanceTravelled+ gastoEnOnFootTmp.distanceTravelled;
                        // reset walking track
                        trackLats = new ArrayList<Double>();
                        trackLongs = new ArrayList<Double>();
                        timestampsTmp = new ArrayList<Long>();
                    }
                }
                // this method ignores the activities "UNKNOWN" and "TILTING"
            }
        }

        closeDB();

        if (onFootActivityVector) {
            onFootActivityVector = false;
            DispendioEnergetico gastoEnOnFootTmp =
                    EstimateMETsAndEffortFromWalkingVector(timestampsTmp, trackLats,trackLongs);
            gastoEnergeticoTotalOnFoot.METsIntBaixa = gastoEnergeticoTotalOnFoot.METsIntBaixa + gastoEnOnFootTmp.METsIntBaixa;
            gastoEnergeticoTotalOnFoot.METsIntModerada = gastoEnergeticoTotalOnFoot.METsIntModerada + gastoEnOnFootTmp.METsIntModerada;
            gastoEnergeticoTotalOnFoot.METsIntVigorosa = gastoEnergeticoTotalOnFoot.METsIntVigorosa + gastoEnOnFootTmp.METsIntVigorosa;
            gastoEnergeticoTotalOnFoot.distanceTravelled = gastoEnergeticoTotalOnFoot.distanceTravelled+ gastoEnOnFootTmp.distanceTravelled;

            // reset walking track
            trackLats = new ArrayList<Double>();
            trackLongs = new ArrayList<Double>();
            timestampsTmp = new ArrayList<Long>();
        }
        value+="***************************\n";
        value+="Sedentary Activity\n";
        value+= "***************************\n";
        value+="Amount of time Still:\n";
        // Log.d(TAG, "***************************");
        // Log.d(TAG, "Sedentary Activity");
        // Log.d(TAG, "***************************");
        // Log.d(TAG, "Amount of time Still:");
        tempoTotalDeAtividadeSedentariaMilliseconds = tempoTotalDeAtividadeSedentariaMilliseconds + stillMillisecondsTotal;
        long amountTimeStillMilliseconds = stillMillisecondsTotal;
        seconds = (int) stillMillisecondsTotal / 1000;
        hours = seconds / 3600;
        minutes = (seconds % 3600) / 60;
        seconds = (seconds % 3600) % 60;
        value+= " Hours: " + hours+"\n";
        value+= " Minutes: " + minutes+"\n";
        value+= " Seconds: " + seconds+"\n";
        // Log.d(TAG, " Hours: " + hours);
        // Log.d(TAG, " Minutes: " + minutes);
        // Log.d(TAG, " Seconds: " + seconds);
        int amountTimeStillHours = hours,amountTimeStillMinute = minutes,amountTimeStillSeconds = seconds;

        value+="***************************\n";
        value+="Amount of time in Vehicle:\n";
        value+= "***************************\n";
        // Log.d(TAG, "***************************");
        // Log.d(TAG, "Amount of time in Vehicle:");
        long amountTimeInVehicleMilliseconds = vehicleMillisecondsTotal;
        tempoTotalDeAtividadeSedentariaMilliseconds = tempoTotalDeAtividadeSedentariaMilliseconds + vehicleMillisecondsTotal;
        seconds = (int) vehicleMillisecondsTotal / 1000;
        hours = seconds / 3600;
        minutes = (seconds % 3600) / 60;
        seconds = (seconds % 3600) % 60;
        value+= " Hours: " + hours+"\n";
        value+= " Minutes: " + minutes+"\n";
        value+= " Seconds: " + seconds+"\n";

        // Log.d(TAG, " Hours: " + hours);
        // Log.d(TAG, " Minutes: " + minutes);
        // Log.d(TAG, " Seconds: " + seconds);
        int amountTimeInVehicleHours=hours,amountTimeInVehicleMinute=minutes,
                amountTimeInVehicleSeconds=seconds;
        value+="***************************\n";
        value+="Active Physical Activityn\n";
        value+= "***************************\n";
        value+="Amount of time on a bicycle:\n";
        // Log.d(TAG, "***************************");
        // Log.d(TAG, "Active Physical Activity");
        // Log.d(TAG, "***************************");
        // Log.d(TAG, "Amount of time on a bicycle:");
        long amountTimeOnBicycleMilliseconds = bicycleMillisecondsTotal;
        tempoTotalDeAtividadeFisicaMilliseconds = tempoTotalDeAtividadeFisicaMilliseconds + bicycleMillisecondsTotal;
        seconds = (int) bicycleMillisecondsTotal / 1000;
        hours = seconds / 3600;
        minutes = (seconds % 3600) / 60;
        seconds = (seconds % 3600) % 60;
        value+= " Hours: " + hours+"\n";
        value+= " Minutes: " + minutes+"\n";
        value+= " Seconds: " + seconds+"\n";
        value+="Cycled a total of : " + gastoEnergeticoTotalOnBicycle.distanceTravelled + " meters.\n";
        // Log.d(TAG, " Hours: " + hours);
        // Log.d(TAG, " Minutes: " + minutes);
        // Log.d(TAG, " Seconds: " + seconds);
        // Log.d(TAG, " Cycled a total of : " + gastoEnergeticoTotalOnBicycle.distanceTravelled + " meters.");
        int amountTimeOnBicycleHours=hours,amountTimeOnBicycleMinute=minutes,
                amountTimeOnBicycleSeconds=seconds;
        value+="Amount of time on foot/walking:\n";
        // Log.d(TAG, "Amount of time on foot/walking:");
        long amountTimeWalkingMilliseconds = onfootMillisecondsTotal;
        tempoTotalDeAtividadeFisicaMilliseconds = tempoTotalDeAtividadeFisicaMilliseconds + onfootMillisecondsTotal;
        seconds = (int) onfootMillisecondsTotal / 1000;
        hours = seconds / 3600;
        minutes = (seconds % 3600) / 60;
        seconds = (seconds % 3600) % 60;
        value+= " Hours: " + hours+"\n";
        value+= " Minutes: " + minutes+"\n";
        value+= " Seconds: " + seconds+"\n";
        value+="Walked a total of : " + gastoEnergeticoTotalOnFoot.distanceTravelled + " meters.\n";
        // Log.d(TAG, " Hours: " + hours);
        // Log.d(TAG, " Minutes: " + minutes);
        // Log.d(TAG, " Seconds: " + seconds);
        // Log.d(TAG, " Walked a total of : " + gastoEnergeticoTotalOnFoot.distanceTravelled + " meters.");

        int amountTimeWalkingHours=hours,amountTimeWalkingMinute=minutes,
                amountTimeWalkingSeconds=seconds;
        value+="Amount of time on Running:\n";
        // Log.d(TAG, "Amount of time on Running:");
        long amountTimeRunningMilliseconds = runningMillisecondsTotal;
        tempoTotalDeAtividadeFisicaMilliseconds = tempoTotalDeAtividadeFisicaMilliseconds + runningMillisecondsTotal;
        seconds = (int) runningMillisecondsTotal / 1000;
        hours = seconds / 3600;
        minutes = (seconds % 3600) / 60;
        seconds = (seconds % 3600) % 60;
        value+= " Hours: " + hours+"\n";
        value+= " Minutes: " + minutes+"\n";
        value+= " Seconds: " + seconds+"\n";
        value+="Ran a total of : " + gastoEnergeticoTotalOnRunning.distanceTravelled + " meters.\n";
        // Log.d(TAG, " Hours: " + hours);
        // Log.d(TAG, " Minutes: " + minutes);
        // Log.d(TAG, " Seconds: " + seconds);
        // Log.d(TAG, " Ran a total of : " + gastoEnergeticoTotalOnRunning.distanceTravelled + " meters.");
        int amountTimeRunningHours=hours,amountTimeRunningMinute=minutes,
                amountTimeRunningSeconds=seconds;
        value+="***************************\n";
        value+="Tempo total de Atividade\n";
        value+= "***************************\n";

        // Log.d(TAG, "***************************");
        // Log.d(TAG, "Tempo total de Atividade:");
        // Log.d(TAG, "***************************");
        long totalAmountActiveActivityMilliseconds = tempoTotalDeAtividadeFisicaMilliseconds;
        long totalAmountSedentaryMilliseconds = tempoTotalDeAtividadeSedentariaMilliseconds;
        seconds = (int) tempoTotalDeAtividadeSedentariaMilliseconds / 1000;
        hours = seconds / 3600;
        minutes = (seconds % 3600) / 60;
        //Log.d(TAG, "Tempo de Atividade sedentária total/semana: " + (hours*60 + minutes) + " minutos.");
        value+= "Tempo de Atividade sedentária total/semana: " + hours+ "H"+minutes+"min.\n";
        // Log.d(TAG, "Tempo de Atividade sedentária total/semana: " + hours+ "H"+minutes+"min.");
        int totalAmountSedentaryHours=hours, totalAmountSedentaryMinutes=minutes;

        seconds = (int) tempoTotalDeAtividadeFisicaMilliseconds / 1000;
        hours = seconds / 3600;
        minutes = (seconds % 3600) / 60;
        //seconds = (seconds % 3600) % 60;
        //int minutosTotais = hours*60 + minutes;
        value+= "Tempo de Atividade física total/semana: " + (hours*60 + minutes) + " minutos.\n";
        // Log.d(TAG, "Tempo de Atividade física total/semana: " + (hours*60 + minutes) + " minutos.");
        int totalAmountActiveActivityInMinutes = (hours*60 + minutes);
        
        value+="***************************\n";
        value+="METs totais de Atividade:\n";
        value+= "***************************\n";

        // Log.d(TAG, "***************************");
        // Log.d(TAG, "METs totais de Atividade:");
        // Log.d(TAG, "***************************");
        double metsTotais = gastoEnergeticoTotalOnBicycle.METsIntBaixa +
                gastoEnergeticoTotalOnBicycle.METsIntModerada +
                gastoEnergeticoTotalOnBicycle.METsIntVigorosa +
                gastoEnergeticoTotalOnFoot.METsIntBaixa +
                gastoEnergeticoTotalOnFoot.METsIntModerada +
                gastoEnergeticoTotalOnFoot.METsIntVigorosa +
                gastoEnergeticoTotalOnRunning.METsIntBaixa +
                gastoEnergeticoTotalOnRunning.METsIntModerada +
                gastoEnergeticoTotalOnRunning.METsIntVigorosa;
        double metsTotaisIntBaixa = gastoEnergeticoTotalOnBicycle.METsIntBaixa +
                gastoEnergeticoTotalOnFoot.METsIntBaixa +
                gastoEnergeticoTotalOnRunning.METsIntBaixa;
        double metsTotaisIntModerada = gastoEnergeticoTotalOnBicycle.METsIntModerada +
                gastoEnergeticoTotalOnFoot.METsIntModerada +
                gastoEnergeticoTotalOnRunning.METsIntModerada;
        double metsTotaisIntVigorosa = gastoEnergeticoTotalOnBicycle.METsIntVigorosa +
                gastoEnergeticoTotalOnFoot.METsIntVigorosa +
                gastoEnergeticoTotalOnRunning.METsIntVigorosa;
        double metsIntBaixa=metsTotaisIntBaixa, metsIntModerada=metsTotaisIntModerada,
                metsIntVigorosa=metsTotaisIntVigorosa;
        value+= "METs totais: " + metsTotais + " ("+new Double(((metsTotaisIntBaixa/metsTotais)*100)).intValue()+"% Int. Baixa, "+new Double(((metsTotaisIntModerada/metsTotais)*100)).intValue()+"% Int. Moderada, e "+new Double(((metsTotaisIntVigorosa/metsTotais)*100)).intValue()+"% Int. Vigorosa.)\n";

        // Log.d(TAG, "METs totais: " + metsTotais + " ("+new Double(((metsTotaisIntBaixa/metsTotais)*100)).intValue()+"% Int. Baixa, "+new Double(((metsTotaisIntModerada/metsTotais)*100)).intValue()+"% Int. Moderada, e "+new Double(((metsTotaisIntVigorosa/metsTotais)*100)).intValue()+"% Int. Vigorosa.)");
        value+= "Dos quais, de intensidade\n";
        value+= "Baixa: " + metsTotaisIntBaixa + " (" + new Double(((gastoEnergeticoTotalOnBicycle.METsIntBaixa/metsTotaisIntBaixa) * 100)).intValue() + "% bicicleta, " + new Double(((gastoEnergeticoTotalOnFoot.METsIntBaixa/metsTotaisIntBaixa)*100)).intValue() + "% a pé, e " +  new Double(((gastoEnergeticoTotalOnRunning.METsIntBaixa/metsTotaisIntBaixa)*100)).intValue() + "% a correr.)\n";
        value+="Moderada: " + metsTotaisIntModerada+ " (" + new Double(((gastoEnergeticoTotalOnBicycle.METsIntModerada/metsTotaisIntModerada)*100)).intValue() + "% bicicleta, " + new Double(((gastoEnergeticoTotalOnFoot.METsIntModerada/metsTotaisIntModerada)*100)).intValue() + "% a pé, e " + new Double(((gastoEnergeticoTotalOnRunning.METsIntModerada/metsTotaisIntModerada)*100)).intValue() + "% a correr.)\n";
        value+="Vigorosa: " + metsTotaisIntVigorosa+ " (" + new Double(((gastoEnergeticoTotalOnBicycle.METsIntVigorosa/metsTotaisIntVigorosa)*100)).intValue() + "% bicicleta, " + new Double(((gastoEnergeticoTotalOnFoot.METsIntVigorosa/metsTotaisIntVigorosa)*100)).intValue() + "% a pé, e " + new Double(((gastoEnergeticoTotalOnRunning.METsIntVigorosa/metsTotaisIntVigorosa)*100)).intValue() + "% a correr.)\n";
        // Log.d(TAG, "Dos quais, de intensidade");
        // Log.d(TAG, "Baixa: " + metsTotaisIntBaixa + " (" + new Double(((gastoEnergeticoTotalOnBicycle.METsIntBaixa/metsTotaisIntBaixa) * 100)).intValue() + "% bicicleta, " + new Double(((gastoEnergeticoTotalOnFoot.METsIntBaixa/metsTotaisIntBaixa)*100)).intValue() + "% a pé, e " +  new Double(((gastoEnergeticoTotalOnRunning.METsIntBaixa/metsTotaisIntBaixa)*100)).intValue() + "% a correr.)");
        // Log.d(TAG, "Moderada: " + metsTotaisIntModerada+ " (" + new Double(((gastoEnergeticoTotalOnBicycle.METsIntModerada/metsTotaisIntModerada)*100)).intValue() + "% bicicleta, " + new Double(((gastoEnergeticoTotalOnFoot.METsIntModerada/metsTotaisIntModerada)*100)).intValue() + "% a pé, e " + new Double(((gastoEnergeticoTotalOnRunning.METsIntModerada/metsTotaisIntModerada)*100)).intValue() + "% a correr.)");
        // Log.d(TAG, "Vigorosa: " + metsTotaisIntVigorosa+ " (" + new Double(((gastoEnergeticoTotalOnBicycle.METsIntVigorosa/metsTotaisIntVigorosa)*100)).intValue() + "% bicicleta, " + new Double(((gastoEnergeticoTotalOnFoot.METsIntVigorosa/metsTotaisIntVigorosa)*100)).intValue() + "% a pé, e " + new Double(((gastoEnergeticoTotalOnRunning.METsIntVigorosa/metsTotaisIntVigorosa)*100)).intValue() + "% a correr.)");
        int metsIntBaixaPercentage=new Double(((metsTotaisIntBaixa/metsTotais)*100)).intValue(),
                metsIntModeradaPercentage=new Double(((metsTotaisIntModerada/metsTotais)*100)).intValue(),
                metsIntVigorosaPercentage=new Double(((metsTotaisIntVigorosa/metsTotais)*100)).intValue();
        int metsIntBaixaBicyclePercentage=new Double(((gastoEnergeticoTotalOnBicycle.METsIntBaixa/metsTotaisIntBaixa) * 100)).intValue(),
                metsIntBaixaWalkingPercentage=new Double(((gastoEnergeticoTotalOnFoot.METsIntBaixa/metsTotaisIntBaixa)*100)).intValue(),
                metsIntBaixaRunningPercentage=new Double(((gastoEnergeticoTotalOnRunning.METsIntBaixa/metsTotaisIntBaixa)*100)).intValue();
        int metsIntModeradaBicyclePercentage=new Double(((gastoEnergeticoTotalOnBicycle.METsIntModerada/metsTotaisIntModerada)*100)).intValue(),
                metsIntModeradaWalkingPercentage=new Double(((gastoEnergeticoTotalOnFoot.METsIntModerada/metsTotaisIntModerada)*100)).intValue(),
                metsIntModeradaRunningPercentage=new Double(((gastoEnergeticoTotalOnRunning.METsIntModerada/metsTotaisIntModerada)*100)).intValue();
        int metsIntVigorosaBicyclePercentage=new Double(((gastoEnergeticoTotalOnBicycle.METsIntVigorosa/metsTotaisIntVigorosa)*100)).intValue(),
                metsIntVigorosaWalkingPercentage=new Double(((gastoEnergeticoTotalOnFoot.METsIntVigorosa/metsTotaisIntVigorosa)*100)).intValue(),
                metsIntVigorosaRunningPercentage=new Double(((gastoEnergeticoTotalOnRunning.METsIntVigorosa/metsTotaisIntVigorosa)*100)).intValue();



        // submit report to the database
        HealthReportsDBManager.getInstance().AddDataToDB(UserProfileManager.getInstance().Get_User_ID(),
        amountTimeStillHours,amountTimeStillMinute,amountTimeStillSeconds,amountTimeInVehicleHours,
        amountTimeInVehicleMinute, amountTimeInVehicleSeconds, amountTimeWalkingHours,
        amountTimeWalkingMinute, amountTimeWalkingSeconds, amountTimeRunningHours,
        amountTimeRunningMinute, amountTimeRunningSeconds,amountTimeOnBicycleHours,
        amountTimeOnBicycleMinute,amountTimeOnBicycleSeconds, totalAmountSedentaryHours,
        totalAmountSedentaryMinutes,totalAmountActiveActivityInMinutes,metsTotais,
        metsIntBaixa, metsIntModerada, metsIntVigorosa, metsIntBaixaPercentage,
        metsIntModeradaPercentage, metsIntVigorosaPercentage,
        metsIntBaixaBicyclePercentage, metsIntBaixaWalkingPercentage,
        metsIntBaixaRunningPercentage, metsIntModeradaBicyclePercentage,
        metsIntModeradaWalkingPercentage, metsIntModeradaRunningPercentage,
        metsIntVigorosaBicyclePercentage, metsIntVigorosaWalkingPercentage,
        metsIntVigorosaRunningPercentage, amountTimeStillMilliseconds,
        amountTimeInVehicleMilliseconds, amountTimeWalkingMilliseconds,
        amountTimeRunningMilliseconds, amountTimeOnBicycleMilliseconds,
        totalAmountSedentaryMilliseconds, totalAmountActiveActivityMilliseconds,
                gastoEnergeticoTotalOnFoot.distanceTravelled,
                gastoEnergeticoTotalOnRunning.distanceTravelled,
                gastoEnergeticoTotalOnBicycle.distanceTravelled);


        Toast.makeText(context, "AMaaS: Daily Report Available.", Toast.LENGTH_LONG).show(); // For example
        return value;
    }

    /**
     * Esta função calcula os METs efetuados dependendo do tipo de atividade, e usa duas
     * coordenadas GPS, bem como dois pontos temporais, para deduzir o nível de intensidade
     * associado.
     *
     * @param activityType 1 (bicycle), 2 (Foot/Walking), 8 (Running)
     * @param time1 O momento temporal inicial
     * @param time2 O momento temporal final
     * @param lat1 latitude da primeira posição
     * @param lon1 longitude da primeira posição
     * @param lat2 latitude da segunda posição
     * @param lon2 longitude da segunda posição
     */
    private DispendioEnergetico EstimateMETsAndEffort(int activityType, java.sql.Timestamp time1, java.sql.Timestamp time2, double lat1, double lon1, double lat2, double lon2) {
        DispendioEnergetico gastoEnergetico = new DispendioEnergetico();
        // java.sql.Timestamp
        long timeDiff = time2.getTime() - time1.getTime();
        int seconds = (int) timeDiff / 1000;
        //int hours = seconds / 3600;
        int minutes = (seconds % 3600) / 60;
        // seconds = (seconds % 3600) % 60;
        final double RADIUS = 6371.01;
        double distance = 0, speed = 0;


        if ((lat1 == 0) || (lon1 == 0) || (lat2 == 0) || (lon2 == 0))
        {
            // these coordinates are zero, do nothing
        }
        else if ((lat1 == lat2) && (lon1 == lon2))
        {
            // these are the same coordinates, do nothing
        }
        else {
            double temp = Math.cos(Math.toRadians(lat1))
                    * Math.cos(Math.toRadians(lat2))
                    * Math.cos(Math.toRadians((lat2) - (lat1)))
                    + Math.sin(Math.toRadians(lat1))
                    * Math.sin(Math.toRadians(lat2));
            distance = temp * RADIUS * Math.PI / 180;
            speed = distance/seconds;

            gastoEnergetico.distanceTravelled = distance;

            // METs de intensidade baixa:       [1.6 ; 2.9 ]
            // METs de intensidade Moderada:    [3.0 ; 5.9 ]
            // METs de intensidade Vigorosa:    [6.0 ; - [
            // e não esquecer que METs é uma métrica por minuto de atividade. Só contam, portanto, as
            // as atividades que completaram um minuto. Nas outras, assume-se um esforço constante
            // durante os minutos reportados
            //if (minutes == 0 && seconds > 0) minutes = 1;

            switch (activityType) {
                case 1: // bicycle
                    if (speed < 16.1) {gastoEnergetico.METsIntModerada = 4;}
                    else if ((speed >= 16.1) && (speed < 19.2)) {gastoEnergetico.METsIntVigorosa = 6 * minutes;}
                    else if ((speed >= 19.2) && (speed < 22.4)) {gastoEnergetico.METsIntVigorosa = 8 * minutes;}
                    else if ((speed >= 22.4) && (speed < 25.6)) {gastoEnergetico.METsIntVigorosa = 10 * minutes;}
                    else if ((speed >= 25.6) && (speed < 30.6)) {gastoEnergetico.METsIntVigorosa = 12 * minutes;}
                    else {
                        // this is Usain Bolt
                        gastoEnergetico.METsIntVigorosa = 16 * minutes;
                    }
                    break;
                case 2: // on foot/walking
                    if (speed < 3.2) {gastoEnergetico.METsIntBaixa = 2 * minutes;}
                    else if ((speed >= 3.2) && (speed < 4)) {gastoEnergetico.METsIntBaixa = 2.5 * minutes;}
                    else if ((speed >= 4) && (speed < 4.8)) {gastoEnergetico.METsIntModerada = 3 * minutes;}
                    else if ((speed >= 4.8) && (speed < 5.6)) {gastoEnergetico.METsIntModerada = 3.3 * minutes;}
                    else if ((speed >= 5.6) && (speed < 6.4)) {gastoEnergetico.METsIntModerada = 3.8 * minutes;}
                    else if ((speed >= 6.4) && (speed < 7.2)) {gastoEnergetico.METsIntModerada = 5 * minutes;}
                    else {
                        // this is a combination of Jog/walk, but received a label of walking/on foot
                        // instead of running
                            gastoEnergetico.METsIntVigorosa = 6.3 * minutes;
                        }
                    break;
                case 8: // running
                    if (speed < 8) {gastoEnergetico.METsIntVigorosa = 7 * minutes;}
                    else if ((speed >= 8) && (speed < 8.4)) {gastoEnergetico.METsIntVigorosa = 8 * minutes;}
                    else if ((speed >= 8.4) && (speed < 9.7)) {gastoEnergetico.METsIntVigorosa = 9 * minutes;}
                    else if ((speed >= 9.7) && (speed < 10.8)) {gastoEnergetico.METsIntVigorosa = 10 * minutes;}
                    else if ((speed >= 10.8) && (speed < 11.3)) {gastoEnergetico.METsIntVigorosa = 11 * minutes;}
                    else if ((speed >= 11.3) && (speed < 12.1)) {gastoEnergetico.METsIntVigorosa = 11.5 * minutes;}
                    else if ((speed >= 12.1) && (speed < 12.9)) {gastoEnergetico.METsIntVigorosa = 12.5 * minutes;}
                    else if ((speed >= 12.9) && (speed < 13.8)) {gastoEnergetico.METsIntVigorosa = 13.5 * minutes;}
                    else if ((speed >= 13.8) && (speed < 14.5)) {gastoEnergetico.METsIntVigorosa = 14 * minutes;}
                    else if ((speed >= 14.5) && (speed < 16.1)) {gastoEnergetico.METsIntVigorosa = 15 * minutes;}
                    else if ((speed >= 16.1) && (speed < 17.5)) {gastoEnergetico.METsIntVigorosa = 16 * minutes;}
                    else {
                        // this is Usain Bolt
                        gastoEnergetico.METsIntVigorosa = 18 * minutes;
                    }
                    break;
                default:
            }
        }

        return gastoEnergetico;
    }

    /**
     * This function approaches the problem differently. That's because when it comes to walking,
     * the smartphone captures a burst of several activities (On Foot, Walking, even Tilting), most of
     * which last a few milliseconds (not seconds or minutes). If I use the other function just like
     * for driving, I will compute much less METs than what it should. This function corrects it by
     * calculating a walked track, and then calculating the total distance travelled plus the total
     * time it took to do such distance. It then assumes an average speed (the downside of this approach).
     *
     * @param timeDiffs
     * @param lats
     * @param longs
     * @return
     */
    private DispendioEnergetico EstimateMETsAndEffortFromWalkingVector(List<Long> timeDiffs, List<Double> lats, List<Double> longs) {
        DispendioEnergetico gastoEnergetico = new DispendioEnergetico();
        double lat1, lat2, lon1, lon2;
        int seconds, minutes;
        final double RADIUS = 6371.01;
        double distance = 0, speed = 0, temp;
        long totalMillis = 0;

        for (int index = 0; index < timeDiffs.size(); index ++)
        {
            lat1 = lats.get(index*2);
            lat2 = lats.get(index*2 + 1);
            lon1 = longs.get(index*2);
            lon2 = longs.get(index*2+1);

            // calcular o tempo total da caminhada
            totalMillis = totalMillis + timeDiffs.get(index);

            if ((lat1 == 0) || (lon1 == 0) || (lat2 == 0) || (lon2 == 0))
            {
                // these coordinates are zero, do nothing
            }
            else if ((lat1 == lat2) && (lon1 == lon2))
            {
                // these are the same coordinates, do nothing
            }
            else {
                // calcula a distancia total da caminhada
                temp = Math.cos(Math.toRadians(lat1))
                        * Math.cos(Math.toRadians(lat2))
                        * Math.cos(Math.toRadians((lat2) - (lat1)))
                        + Math.sin(Math.toRadians(lat1))
                        * Math.sin(Math.toRadians(lat2));
                distance = distance + temp * RADIUS * Math.PI / 180;
            }
        }

        seconds = (int) totalMillis / 1000;
        minutes = (seconds % 3600) / 60;
        speed = distance/seconds;

        gastoEnergetico.distanceTravelled = distance;

        // METs de intensidade baixa:       [1.6 ; 2.9 ]
        // METs de intensidade Moderada:    [3.0 ; 5.9 ]
        // METs de intensidade Vigorosa:    [6.0 ; - [
        // e não esquecer que METs é uma métrica por minuto de atividade. Só contam, portanto, as
        // as atividades que completaram um minuto. Nas outras, assume-se um esforço constante
        // durante os minutos reportados
        //if (minutes == 0 && seconds > 0) minutes = 1;

        if (speed < 3.2) {gastoEnergetico.METsIntBaixa = 2 * minutes;}
        else if ((speed >= 3.2) && (speed < 4)) {gastoEnergetico.METsIntBaixa = 2.5 * minutes;}
        else if ((speed >= 4) && (speed < 4.8)) {gastoEnergetico.METsIntModerada = 3 * minutes;}
        else if ((speed >= 4.8) && (speed < 5.6)) {gastoEnergetico.METsIntModerada = 3.3 * minutes;}
        else if ((speed >= 5.6) && (speed < 6.4)) {gastoEnergetico.METsIntModerada = 3.8 * minutes;}
        else if ((speed >= 6.4) && (speed < 7.2)) {gastoEnergetico.METsIntModerada = 5 * minutes;}
        else {
            // this is a combination of Jog/walk, but received a label of walking/on foot
            // instead of running
            gastoEnergetico.METsIntVigorosa = 6.3 * minutes;
        }

        return gastoEnergetico;
    }

    private class DispendioEnergetico {
        double METsIntBaixa;
        double METsIntModerada;
        double METsIntVigorosa;
        double distanceTravelled;
        public DispendioEnergetico ()
        {METsIntBaixa = 0;METsIntModerada = 0;METsIntVigorosa = 0;distanceTravelled=0;}
        public DispendioEnergetico (double mBaixo, double mModerada, double mVigorosa,double distance){
            METsIntBaixa = mBaixo;METsIntModerada = mModerada;METsIntVigorosa = mVigorosa;
            distanceTravelled = distance;}
    }

    private List<ActivitiesDataModal> getDBActivityRecords(Context context) throws Exception {
        try {
            realm = Realm.getDefaultInstance();
        }
        catch (java.lang.IllegalStateException e){
            Log.d(TAG,"Tried getting Realm default Instance at getDBActivityRecords in ReportAlarm. Initializing it first. Error: " + e.getMessage());
            /*if (context == null)
            {
                Realm.init(Realm.getApplicationContext());
            }
            else {
                Realm.init(context);
            }*/
            if (Realm.getApplicationContext() == null)
            {
                if (context != null)
                {
                    Realm.init(context);
                }
                else if (HARModuleManager.mainActivityObj != null) {
                    Realm.init(HARModuleManager.mainActivityObj);
                }
                else {
                    throw new Exception("getDBActivityRecords: Problem with Contexts being null.");
                }
            }
            else {
                Realm.init(Realm.getApplicationContext());
            }


            // on below line we are setting realm configuration
            RealmConfiguration config =
                    new RealmConfiguration.Builder()
                            //.name("DetectedActivities.db")
                            .name(HARModuleManager.PORTIC_Database_Name)
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
            Realm.setDefaultConfiguration(config);

            realm = Realm.getDefaultInstance();
        }


        List<ActivitiesDataModal> modals = new ArrayList<ActivitiesDataModal>();

        // on below line we are getting data from realm database in our list.
        modals = realm.where(ActivitiesDataModal.class).findAll();
        //realm.close();

        return modals;
    }

    private void DeleteDBRecords(Context context) {
        try {
            realm = Realm.getDefaultInstance();
        }
        catch (java.lang.IllegalStateException e){
            Log.d(TAG,"Tried getting Realm default Instance at DeleteDBRecords in ReportAlarm. Initializing it first. Error: " + e.getMessage());
            if (context == null)
            {
                Realm.init(Realm.getApplicationContext());
            }
            else {
                Realm.init(context);
            }

            // on below line we are setting realm configuration
            RealmConfiguration config =
                    new RealmConfiguration.Builder()
                            //.name("DetectedActivities.db")
                            .name(HARModuleManager.PORTIC_Database_Name)
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
            Realm.setDefaultConfiguration(config);

            realm = Realm.getDefaultInstance();
        }


        List<ActivitiesDataModal> modals = new ArrayList<ActivitiesDataModal>();

        // on below line we are getting data from realm database in our list.
        modals = realm.where(ActivitiesDataModal.class).findAll();
        for (ActivitiesDataModal m : modals) {
            realm.executeTransaction(new Realm.Transaction() {
                @Override
                public void execute(Realm realm) {
                    m.deleteFromRealm();
                }
            });
        }

        realm.close();
    }

    private void closeDB() {realm.close();}
}
