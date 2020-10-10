package com.example.bikecheckup;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

public class NotificationHelper extends AppCompatActivity implements PushNotificationsController{

    public static final String CHANNEL_ID = "ch1";

    /*
    Creates notification channel to send push notifications, requires version 26+ (VERSION_CODE O)
    Creates 1 channel currently
    Inputs:
        context - this environment
    Outputs: null
     */
    @RequiresApi(api = Build.VERSION_CODES.O)
    public void createNotificationChannels(Context context) {
        NotificationChannel chan1 = new NotificationChannel(
                CHANNEL_ID,
                "Channel 1",
                NotificationManager.IMPORTANCE_HIGH
        );
        NotificationManager manager = context.getSystemService(NotificationManager.class);
        manager.createNotificationChannel(chan1);
    }

    /*
    Pushes default priority notification
    Inputs:
        context - this environment
        title - title to display on notification
        text - description to display on notification
    Outputs: null
     */
    public void pushNotification(Context context, String title, String text) {
        NotificationCompat.Builder notify =
                new NotificationCompat.Builder(context, CHANNEL_ID)
                        .setSmallIcon(R.drawable.ic_launcher_foreground)
                        .setContentTitle(title)
                        .setContentText(text)
                        .setPriority(NotificationCompat.PRIORITY_DEFAULT);

        NotificationManagerCompat manager = NotificationManagerCompat.from(context);
        manager.notify(1, notify.build());
    }
}
