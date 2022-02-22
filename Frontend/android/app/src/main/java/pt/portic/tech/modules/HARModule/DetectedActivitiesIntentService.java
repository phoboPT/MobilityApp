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

import android.Manifest;
import android.app.AlertDialog;
import android.app.IntentService;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.ActivityRecognitionResult;
import com.google.android.gms.location.DetectedActivity;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;

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
public class DetectedActivitiesIntentService extends IntentService implements LocationListener, GoogleApiClient.ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener {

    //protected final String TAGs = DetectedActivitiesIntentService.class.getSimpleName();
    protected String TAGs;
    final String TAG = "DetectedActivModule";
    private long UPDATE_INTERVAL = 10 * 1000;  /* 10 secs */
    private long FASTEST_INTERVAL = 2000; /* 2 sec */
    static final int MY_PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION = 1;
    public static double latitude, longitude = 0.0;
    GoogleApiClient gac;
    LocationRequest locationRequest;

    public DetectedActivitiesIntentService() {
        // Use the TAG to name the worker thread.
        super(DetectedActivitiesIntentService.class.getSimpleName());
        TAGs = DetectedActivitiesIntentService.class.getSimpleName();

    }

    @Override
    public void onCreate() {
        super.onCreate();
        isGooglePlayServicesAvailable();

        if (!isLocationEnabled())
            showAlert();

        locationRequest = new LocationRequest();
        locationRequest.setInterval(UPDATE_INTERVAL);
        locationRequest.setFastestInterval(FASTEST_INTERVAL);
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        gac = new GoogleApiClient.Builder(this)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();

        gac.connect();
    }


    protected void onHandleIntent(Intent intent) {
        ActivityRecognitionResult result = ActivityRecognitionResult.extractResult(intent);

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        if (!gac.isConnected())
        {
            gac.connect();
        }

        Location ll = LocationServices.FusedLocationApi.getLastLocation(gac);
        Log.d(TAG, "LastLocation: " + (ll == null ? "NO LastLocation" : ll.toString()));
        long hour;
        Calendar rightNow = Calendar.getInstance();
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
                hour = rightNow.get(Calendar.HOUR_OF_DAY);

                // test if this is night time (if it is bed time, it's uninteresting to
                // capture the "still" periods and count them as sedentary
                // I'll ignore STILL activities between 22h and 09h
                if ((activity.getType() == 3) && ((hour >= HARModuleManager.sleepTimeA) || (hour < HARModuleManager.sleepTimeB))) {
                    Log.d(TAG,"Ignored activity " + DetectedActivityGetType(activity.getType()) +
                            " at " + (timestamp).toString() + " because .it's night time: [" +
                            HARModuleManager.sleepTimeA + "H - " + HARModuleManager.sleepTimeB + "H]. Current hour is " + hour + "H.");
                }
                else {
                    // if it's not night time, or even if it is but the activity is not STIL,
                    // then record it.
                    if (activity.getConfidence() >= HARModuleManager.CONFIDENCE) {
                        RealmDataBaseManager.getInstance().AddDataToDB(UserProfileManager.getInstance().Get_User_ID(),
                                (timestamp).toString(),
                                activity.getType(),
                                DetectedActivityGetType(activity.getType()),
                                activity.getConfidence(),
                                this.latitude,
                                this.longitude);
                    }
                }
            }
        } catch (java.lang.NullPointerException e) {
            Log.e("DetectedActIntentServ", "Erro: " + e.toString());
        }

        // request location update
        try {
            LocationServices.FusedLocationApi.requestLocationUpdates(gac, locationRequest, this);
        }catch (java.lang.IllegalStateException e)
        {
            Log.e("DetectedActIntentServ", "Erro: " + e.toString());
        }
        //gac.connect();

    }

    private String DetectedActivityGetType(int type) {
        switch (type) {
            case 0:
                return "IN_VEHICLE";
            case 1:
                return "ON_BICYCLE";
            case 2:
                return "ON_FOOT";
            case 3:
                return "STILL";
            case 4:
                return "UNKNOWN";
            case 5:
                return "TILTING";
            case 7:
                return "WALKING";
            case 8:
                return "RUNNING";
            default:
                return "UNKNOWN";
        }
    }

    // In onHandleIntent() method, list of probable activities will be retried and broadcasted
    // using LocalBroadcastManager.
    private void broadcastActivity(DetectedActivity activity, java.sql.Timestamp timestamp) {
        Intent intent = new Intent(HARModuleManager.BROADCAST_DETECTED_ACTIVITY);
        intent.putExtra("userID", UserProfileManager.getInstance().Get_User_ID());
        intent.putExtra("type", activity.getType());
        intent.putExtra("description", DetectedActivityGetType(activity.getType()));
        intent.putExtra("timestamp", timestamp);
        intent.putExtra("confidence", activity.getConfidence());
        intent.putExtra("latitude", this.latitude);
        intent.putExtra("longitude", this.longitude);

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        LocationServices.FusedLocationApi.requestLocationUpdates(
                gac, locationRequest, this);

        LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
    }

    @Override
    public void onDestroy() {
        //super.onDestroy();
        Log.d("DetectedActIntentServ", "onDestroy()");

        Intent broadcastIntent = new Intent();
        broadcastIntent.setAction("Restart_AMaaS_Service");
        broadcastIntent.setClass(this, BackgroundServicesRestarter.class);
        //broadcastIntent.setClass(this, DetectedActivitiesIntentService.class);
        this.sendBroadcast(broadcastIntent);

        gac.disconnect();

        super.onDestroy();
    }


    @Override
    public void onConnected(@Nullable Bundle bundle) {
        if (ActivityCompat.checkSelfPermission(HARModuleManager.mainActivityObj, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {

            ActivityCompat.requestPermissions(HARModuleManager.mainActivityObj,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    MY_PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION);

            return;
        }
        Log.d(TAG, "onConnected");

        Location ll = LocationServices.FusedLocationApi.getLastLocation(gac);
        Log.d(TAG, "LastLocation: " + (ll == null ? "NO LastLocation" : ll.toString()));

        LocationServices.FusedLocationApi.requestLocationUpdates(gac, locationRequest, this);
    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        Toast.makeText(HARModuleManager.mainActivityObj, "onConnectionFailed: \n" + connectionResult.toString(),
                Toast.LENGTH_LONG).show();
        Log.d(TAG, connectionResult.toString());
    }

    @Override
    public void onLocationChanged(Location location) {
        if (location != null) {
            //updateUI(location);
            this.latitude = location.getLatitude();
            this.longitude = location.getLongitude();
            Log.d(TAG, "On Location changed: [" + latitude + ";"+longitude+"].");
        }
    }

    private boolean isLocationEnabled() {
        LocationManager locationManager =
                (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
                locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
    }

    private boolean isGooglePlayServicesAvailable() {
        final int PLAY_SERVICES_RESOLUTION_REQUEST = 9000;
        GoogleApiAvailability apiAvailability = GoogleApiAvailability.getInstance();
        int resultCode = apiAvailability.isGooglePlayServicesAvailable(this);
        if (resultCode != ConnectionResult.SUCCESS) {
            if (apiAvailability.isUserResolvableError(resultCode)) {
                apiAvailability.getErrorDialog(HARModuleManager.mainActivityObj, resultCode, PLAY_SERVICES_RESOLUTION_REQUEST)
                        .show();
            } else {
                Log.d(TAG, "This device is not supported.");
                HARModuleManager.mainActivityObj.finish();
            }
            return false;
        }
        Log.d(TAG, "This device is supported.");
        return true;
    }

    private void showAlert() {
        final AlertDialog.Builder dialog = new AlertDialog.Builder(this);
        dialog.setTitle("Enable Location")
                .setMessage("Your Locations Settings is set to 'Off'.\nPlease Enable Location to " +
                        "use this app")
                .setPositiveButton("Location Settings", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface paramDialogInterface, int paramInt) {

                        Intent myIntent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                        startActivity(myIntent);
                    }
                })
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface paramDialogInterface, int paramInt) {
                        HARModuleManager.getInstance().HAR_Stop_Service();
                        Toast.makeText(HARModuleManager.mainActivityObj,
                                "Location services are off. The recognition of the amount of physical activity you perform cannot be assessed.",
                                Toast.LENGTH_LONG)
                                .show();
                    }
                });
        dialog.show();
    }
}
