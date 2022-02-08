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
package pt.portic.tech.modules.UserProfile;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.portic_tech_modules.MainApplication;

import java.util.Map;

import pt.portic.tech.modules.Public_API_UserProfile_Module;

public class UserProfileManager extends ReactContextBaseJavaModule implements Public_API_UserProfile_Module {

    /********************************************************************************
     ***************************** Módulo User Profile ******************************
     ************ para armazenamento do perfil + preferências do utilizador *********
     *******************************************************************************/

    SharedPreferences sharedpreferences;
    public static final String MyPREFERENCES = "UserPreferences" ;
    public static final String user_ID = "user_ID";
    public static final String user_Name = "user_Name";
    public static final String user_BirthDate = "user_BirthDate";
    public static final String user_Gender = "user_Gender";
    public static final String user_Height = "user_Height";
    public static final String user_Weight = "user_Weight";
    public static final String healthActivityRisk = "healthActivityRisk";
    public static final String dateOfLastWeeklyReport = "dateOfLastWeeklyReport";


    /*
     *   Singleton Pattern
     */

    //Early, instance will be created at load time
    private static UserProfileManager UserProfileManagerSingleton=new UserProfileManager();
    public UserProfileManager() {
        // getting the context of the main application, to access the application preferences
        sharedpreferences = MainApplication.getAppContext().
                getSharedPreferences(MyPREFERENCES, Context.MODE_PRIVATE);
        Log.d("UserProfileModule", "Shared preferences storage prepared.");
    }
    public static UserProfileManager getInstance(){
        if (UserProfileManagerSingleton == null){
            synchronized(UserProfileManager.class){
                if (UserProfileManagerSingleton == null){
                    UserProfileManagerSingleton = new UserProfileManager();//instance will be created at request time
                }
            }
        }

        return UserProfileManagerSingleton;
    }


    @ReactMethod
    @Override
    public void Set_User_ID(String id) {
        SharedPreferences.Editor editor = sharedpreferences.edit();
        editor.putString(user_ID, id);
        editor.commit();
    }

    @ReactMethod
    @Override
    public void Set_User_Name(String name) {
        SharedPreferences.Editor editor = sharedpreferences.edit();
        editor.putString(user_Name, name);
        editor.commit();
    }

    @ReactMethod
    @Override
    public void Set_User_BirthDate(String date) {
        SharedPreferences.Editor editor = sharedpreferences.edit();
        editor.putLong(user_BirthDate, new Long(Long.parseLong(date)));
        editor.commit();
    }

    @ReactMethod
    @Override
    public void Set_User_Gender(String gender) {
        SharedPreferences.Editor editor = sharedpreferences.edit();
        editor.putString(user_Gender, gender);
        editor.commit();
    }

    @ReactMethod
    @Override
    public void Set_User_Height(String height) {
        SharedPreferences.Editor editor = sharedpreferences.edit();
        editor.putFloat(user_Height, new Float(Float.parseFloat(height)));
        editor.commit();
    }

    @ReactMethod
    @Override
    public void Set_User_Weight(String weight) {
        SharedPreferences.Editor editor = sharedpreferences.edit();
        editor.putFloat(user_Weight, new Float(Float.parseFloat(weight)));
        editor.commit();
    }

    @ReactMethod
    @Override
    public void Set_Health_Activity_Risk(String risk) {
        SharedPreferences.Editor editor = sharedpreferences.edit();
        editor.putInt(healthActivityRisk, new Integer(Integer.parseInt(risk)));
        editor.commit();
    }

    @ReactMethod
    @Override
    public void Set_Date_Of_Last_Weekly_Report(String date) {
        SharedPreferences.Editor editor = sharedpreferences.edit();
        editor.putString(dateOfLastWeeklyReport, date);
        editor.commit();
    }


    @ReactMethod
    @Override
    public Map<String, ?> Get_User_ALL_Data() {
        return sharedpreferences.getAll();
    }

    @ReactMethod
    @Override
    public String Get_User_ID() {
        return sharedpreferences.getString("user_ID","N/A");
    }

    @ReactMethod
    @Override
    public String Get_User_Name() {
        return sharedpreferences.getString("user_Name","N/A");
    }

    @ReactMethod
    @Override
    public Long Get_User_BirthDate() {
        return sharedpreferences.getLong("user_BirthDate",new Long(0));
    }

    @ReactMethod
    @Override
    public String Get_User_Gender() {
        return sharedpreferences.getString("user_Gender","N/A");
    }

    @ReactMethod
    @Override
    public Float Get_User_Height() {
        return sharedpreferences.getFloat("user_Height",new Float(0.0));
    }

    @ReactMethod
    @Override
    public Float Get_User_Weight() {
        return sharedpreferences.getFloat("user_Weight",new Float(0.0));
    }

    @ReactMethod
    @Override
    public Integer Get_Health_Activity_Risk() { // default is 1, risk is low
        return sharedpreferences.getInt("healthActivityRisk",new Integer(1));
    }
    @ReactMethod
    @Override
    public String Get_Date_Of_Last_Weekly_Report() {
        return sharedpreferences.getString("dateOfLastWeeklyReport",new String(""));
    }



    @NonNull
    @Override
    public String getName() {
        return "UserProfileModule";
    }
}
