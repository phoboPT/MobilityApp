package com.FrontEndNativoXavier;

import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.google.android.material.snackbar.Snackbar;
import com.portic_tech_modules.R;
import com.portic_tech_modules.databinding.ActivityInteractWithBackgroundBinding;

import pt.portic.tech.modules.HARModule.HARModuleManager;

//import com.FrontEndNativoXavier.databinding.ActivityInteractWithBackgroundBinding;

public class ActivityInteractWithBackground extends AppCompatActivity {

   private AppBarConfiguration appBarConfiguration;
   private ActivityInteractWithBackgroundBinding binding;
   //private Button readCourseBtn;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        HARModuleManager.mainActivityObj = this;

        binding = ActivityInteractWithBackgroundBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setSupportActionBar(binding.toolbar);

        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_activity_interact_with_background);
        appBarConfiguration = new AppBarConfiguration.Builder(navController.getGraph()).build();
        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);

        binding.fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });


       // readCourseBtn = findViewById(R.id.idBtnReadData);
        /*
        readCourseBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i = new Intent(ActivityInteractWithBackground.this, ReadCoursesActivity .class);
                startActivity(i);
            }
        });*/
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_activity_interact_with_background);
        return NavigationUI.navigateUp(navController, appBarConfiguration)
                || super.onSupportNavigateUp();
    }
}