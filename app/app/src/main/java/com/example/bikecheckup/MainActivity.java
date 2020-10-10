package com.example.bikecheckup;

import androidx.appcompat.app.AppCompatActivity;

import android.app.Notification;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainActivity extends AppCompatActivity {

    private Button notify_test_btn;
    private Button schedule_btn;
    private Button history_btn;
    private Button bikes_btn;
    private Button activities_btn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        PushNotificationsController pushNotify = new NotificationHelper();
        pushNotify.createNotificationChannels(getApplicationContext());

        //Test button for notifications
        notify_test_btn = findViewById(R.id.notif_button);
        notify_test_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                pushNotify.pushNotification(getApplicationContext(), "test title", "test description");
            }
        });

        //Placeholder button for Maintenance Schedule
        schedule_btn = findViewById(R.id.maint_schedule_button);
        schedule_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent scheduleIntent = new Intent(MainActivity.this, MaintenanceScheduleActivity.class);
                startActivity(scheduleIntent);
            }
        });

        //Placeholder button for Maintenance History
        history_btn = findViewById(R.id.maint_history_button);
        history_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent historyIntent = new Intent(MainActivity.this, MaintenanceHistoryActivity.class);
                startActivity(historyIntent);
            }
        });

        //Placeholder button for Bikes view
        bikes_btn = findViewById(R.id.bikes_button);
        bikes_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent bikesIntent = new Intent(MainActivity.this, BikesActivity.class);
                startActivity(bikesIntent);
            }
        });

        //Placeholder button for Activities view
        activities_btn = findViewById(R.id.activities_button);
        activities_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent activitiesIntent = new Intent(MainActivity.this, ActivitiesActivity.class);
                startActivity(activitiesIntent);
            }
        });
    }
}