package com.example.bikecheckup;

import android.content.Context;

public interface PushNotificationsController {
    void createNotificationChannels(Context context);
    void pushNotification(Context context, String title, String text);
}
