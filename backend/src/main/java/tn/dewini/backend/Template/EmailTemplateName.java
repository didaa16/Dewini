package tn.dewini.backend.Template;

public enum EmailTemplateName {
    ACTIVATE_ACCOUNT("activate_account"),
    RESET_PASSWORD("reset_password"),
    BAN_NOTIFICATION("ban_notification"),
    UNBAN_NOTIFICATION("unban_notification");

    private final String templateName;

    EmailTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getTemplateName() {
        return templateName;
    }
}