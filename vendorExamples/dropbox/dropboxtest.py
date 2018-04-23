ACCESS_TOKEN = "6ptzDsC1glAAAAAAAAAADYPiBLG2JO8kMJDTF7L9lgngpErvHH2F2Aj4ctTwBoC1"

import dropbox
dbx = dropbox.Dropbox(ACCESS_TOKEN)
y = dbx.users_get_current_account()
print(y)