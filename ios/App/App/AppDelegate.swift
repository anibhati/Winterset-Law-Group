import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            if let webView = (self.window?.rootViewController as? CAPBridgeViewController)?.webView {
                webView.scrollView.bounces = false
                webView.scrollView.backgroundColor = UIColor(red: 16/255, green: 40/255, blue: 59/255, alpha: 1.0)
                webView.backgroundColor = UIColor(red: 16/255, green: 40/255, blue: 59/255, alpha: 1.0)
            }
        }
        
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {}
    func applicationDidEnterBackground(_ application: UIApplication) {}
    func applicationWillEnterForeground(_ application: UIApplication) {}
    func applicationDidBecomeActive(_ application: UIApplication) {}
    func applicationWillTerminate(_ application: UIApplication) {}
}
