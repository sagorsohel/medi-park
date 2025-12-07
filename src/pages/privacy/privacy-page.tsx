import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'

export default function PrivacyPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading="Privacy Policy" alt="Privacy Policy Hero" />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Privacy Policy" />

      {/* Privacy Policy Content */}
      <div className="w-full bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-gray-700">
            {/* Introduction */}
            <div className="space-y-4">
              <p className="text-justify">
                Thank you for being part of our community at Evercare Hospital Dhaka and Evercare Hospital Chattogram.
                We are committed to protecting your personal information and your right to privacy. If you have any
                questions or concerns about this privacy notice or our practices with regard to your personal information,
                please contact us at <a href="mailto:privacy_officer@evercarebd.com" className="text-blue-600 hover:underline">privacy_officer@evercarebd.com</a>.
              </p>
            </div>

            {/* Scope and Definitions */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Scope and Definitions</h2>
              <p className="text-justify">
                This privacy notice describes how we might use your information if you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Visit our website at <a href="http://www.medipark.com" className="text-blue-600 hover:underline">http://www.medipark.com</a></li>
                <li>Use our mobile application</li>
                <li>Engage with us in other related ways, including any sales, marketing, or events</li>
              </ul>

              <div className="mt-6 space-y-3">
                <p className="text-justify font-semibold">In this privacy notice, if we refer to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>"Website,"</strong> we are referring to any website of ours that references or links to this policy</li>
                  <li><strong>"Services,"</strong> we are referring to our Website and other related services, including any sales, marketing, or events</li>
                  <li><strong>"Apps,"</strong> we are referring to our Web Application/Mobile application that references or links to this policy</li>
                </ul>
              </div>
            </div>

            {/* Purpose */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Purpose of This Privacy Notice</h2>
              <p className="text-justify">
                The purpose of this privacy notice is to explain to you in the clearest way possible what information
                we collect, how we use it, and what rights you have in relation to it. If there are any terms in this
                privacy notice that you do not agree with, please discontinue use of our Services immediately.
              </p>
              <p className="text-justify">
                Please read this privacy notice carefully, as it will help you understand what we do with the information
                that we collect.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Table of Contents</h2>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>WHAT INFORMATION DO WE COLLECT?</li>
                <li>HOW DO WE USE YOUR INFORMATION?</li>
                <li>WILL YOUR INFORMATION BE SHARED WITH ANYONE?</li>
                <li>HOW LONG DO WE KEEP YOUR INFORMATION?</li>
                <li>HOW DO WE KEEP YOUR INFORMATION SAFE?</li>
                <li>WHAT ARE YOUR PRIVACY RIGHTS?</li>
                <li>CONTROLS FOR DO-NOT-TRACK FEATURES</li>
                <li>DO WE MAKE UPDATES TO THIS NOTICE?</li>
                <li>HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</li>
                <li>HOW CAN YOU REVIEW, UPDATE OR DELETE THE DATA WE COLLECT FROM YOU?</li>
              </ol>
            </div>

            {/* Section 1 */}
            <div className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-primary mb-4">1. WHAT INFORMATION DO WE COLLECT?</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal information you disclose to us</h3>
              <p className="text-justify font-semibold text-gray-900">
                <strong>In Short:</strong> We collect Personal and health related information that you provide to us.
              </p>
              <p className="text-justify">
                We collect personal information that you voluntarily provide to us when you express an interest in
                obtaining information about us or our products and Services, when you participate in activities on
                the Website or Apps, or otherwise when you contact us.
              </p>
              <p className="text-justify">
                The personal information that we collect depends on the context of your interactions with us and the
                Website or Apps, the choices you make, and the products and features you use. The personal information
                we collect may include the following:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Names</li>
                <li>Phone numbers</li>
                <li>Email addresses</li>
                <li>Mailing addresses</li>
                <li>Health-related information</li>
              </ul>
              <p className="text-justify mt-4">
                All personal information that you provide to us must be true, complete, and accurate, and you must
                notify us of any changes to such personal information.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-primary mb-4">2. HOW DO WE USE YOUR INFORMATION?</h2>
              <p className="text-justify font-semibold text-gray-900">
                <strong>In Short:</strong> Your personal information, identity shall not be disclosed or used in any
                research publication without your consent. Your information shall only be accessible to you, person
                nominated by you and the healthcare staff of the hospital.
              </p>
              <p className="text-justify">
                We use personal information collected via our Website or Hospital Apps for a variety of business purposes
                described below. We process your personal information for these purposes in reliance on our legitimate
                business interests, in order to enter into or perform a contract with you, with your consent, and/or for
                compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each
                purpose listed below.
              </p>
              <p className="text-justify font-semibold mt-4">We use the information we collect or receive:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>To fulfill and manage your orders.</strong> We may use your information to fulfill and manage
                  your orders, payments, returns, and exchanges made through the Website or Apps.</li>
                <li><strong>To administer prize draws and competitions.</strong> We may use your information to administer
                  prize draws and competitions when you elect to participate in our competitions.</li>
                <li><strong>To deliver and facilitate delivery of services to the user.</strong> We may use your information
                  to provide you with the requested service.</li>
                <li><strong>To respond to user inquiries/offer support to users.</strong> We may use your information to
                  respond to your inquiries and solve any potential issues you might have with the use of our Services.</li>
                <li><strong>To send administrative information to you.</strong> We may use your personal information to send
                  you product, service, and new feature information and/or information about changes to our terms, conditions,
                  and policies.</li>
                <li><strong>To protect our Services.</strong> We may use your information as part of our efforts to keep
                  our Website and Apps safe and secure (for example, for fraud monitoring and prevention).</li>
                <li><strong>To enable user-to-user communications.</strong> We may use your information to enable user-to-user
                  communications with each user's consent.</li>
                <li><strong>To request feedback.</strong> We may use your information to request feedback and to contact you
                  about your use of our Website or Apps.</li>
                <li><strong>To send you marketing and promotional communications.</strong> We and/or our third-party marketing
                  partners may use the personal information you send to us for our marketing purposes, if this is in accordance
                  with your marketing preferences. For example, when expressing an interest in obtaining information about us or
                  our Website, subscribing to marketing, or otherwise contacting us, we will collect personal information from you.
                  You can opt-out of our marketing emails at any time.</li>
                <li><strong>To post testimonials.</strong> We post testimonials on our Website or Apps that may contain personal
                  information. Prior to posting a testimonial, we will obtain your consent to use your name and the content of the
                  testimonial. If you wish to update or delete your testimonial, please contact us and be sure to include your name,
                  testimonial location, and contact information.</li>
                <li><strong>To manage user accounts.</strong> We may use your information for the purposes of managing our account
                  and keeping it in working order.</li>
                <li><strong>To deliver services to the user.</strong> We may use your information to provide you with the requested
                  service.</li>
                <li><strong>To respond to legal requests and prevent harm.</strong> If we receive a subpoena or other legal request,
                  we may need to inspect the data we hold to determine how to respond.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-primary mb-4">3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h2>
              <p className="text-justify font-semibold text-gray-900">
                <strong>In Short:</strong> We only share information with your consent, to comply with laws, to provide you
                with services, to protect your rights, or to fulfill business obligations.
              </p>
              <p className="text-justify">
                We may process or share your data that we hold based on the following legal basis:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal
                  information for a specific purpose.</li>
                <li><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve
                  our legitimate business interests.</li>
                <li><strong>Performance of a Contract:</strong> Where we have entered into a contract with you, we may process
                  your personal information to fulfill the terms of our contract.</li>
                <li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so
                  in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
                <li><strong>Vital Interests:</strong> We may disclose your information where we believe it is necessary to investigate,
                  prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential
                  threats to the safety of any person, and illegal activities, or as evidence in litigation in which we are involved.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-primary mb-4">4. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
              <p className="text-justify font-semibold text-gray-900">
                <strong>In Short:</strong> We keep your information for as long as necessary to fulfill the purposes outlined in
                this privacy notice unless otherwise required by law.
              </p>
              <p className="text-justify">
                We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy
                notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal
                requirements). No purpose in this notice will require us keeping your personal information for longer than the period
                of time in which users have an account with us.
              </p>
              <p className="text-justify">
                When we have no ongoing legitimate business need to process your personal information, we will either delete or
                anonymize such information, or, if this is not possible (for example, because your personal information has been
                stored in backup archives), then we will securely store your personal information and isolate it from any further
                processing until deletion is possible.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-primary mb-4">5. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
              <p className="text-justify font-semibold text-gray-900">
                <strong>In Short:</strong> We aim to protect your personal information through a system of organizational and
                technical security measures.
              </p>
              <p className="text-justify">
                We have implemented appropriate technical and organizational security measures designed to protect the security of
                any personal information we process. However, despite our safeguards and efforts to secure your information, no
                electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so
                we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able
                to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our
                best to protect your personal information, transmission of personal information to and from our Website or Apps
                is at your own risk. You should only access the Website or Apps within a secure environment.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-primary mb-4">6. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
              <p className="text-justify font-semibold text-gray-900">
                <strong>In Short:</strong> You may review, change, or terminate your account at any time.
              </p>
              <p className="text-justify">
                If you are a resident in certain regions, you may have certain rights regarding your personal information. These
                may include the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Request access and obtain a copy of your personal information</li>
                <li>Request rectification or erasure</li>
                <li>Restrict the processing of your personal information</li>
                <li>Data portability</li>
                <li>Object to the processing of your personal information</li>
              </ul>
              <p className="text-justify mt-4">
                If you would at any time like to review or change the information in your account or terminate your account, you can:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Contact us using the contact information provided</li>
                <li>Log in to your account settings and update your user account</li>
              </ul>
              <p className="text-justify mt-4">
                Upon your request to terminate your account, we will deactivate or delete your account and information from our
                active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems,
                assist with any investigations, enforce our Terms of Use and/or comply with applicable legal requirements.
              </p>
            </div>

            {/* Section 7 */}
            <div className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-primary mb-4">7. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
              <p className="text-justify">
                Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature
                or setting you can activate to signal your privacy preference not to have data about your online browsing activities
                monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals
                has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically
                communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in
                the future, we will inform you about that practice in a revised version of this privacy notice.
              </p>
            </div>

            {/* Section 8 */}
            <div className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-primary mb-4">8. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
              <p className="text-justify font-semibold text-gray-900">
                <strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.
              </p>
              <p className="text-justify">
                We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised"
                date and the updated version will be effective as soon as it is accessible. If we make material changes to this
                privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending
                you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting
                your information.
              </p>
            </div>

            {/* Section 9 */}
            <div className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-primary mb-4">9. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
              <p className="text-justify">
                If you have questions or comments about this notice, you may contact our Privacy Officer by email at{' '}
                <a href="mailto:privacy_officer@evercarebd.com" className="text-blue-600 hover:underline">privacy_officer@evercarebd.com</a>.
              </p>
            </div>

            {/* Section 10 */}
            <div className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-primary mb-4">10. HOW CAN YOU REVIEW, UPDATE OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
              <p className="text-justify">
                Based on the applicable laws of your country, you may have the right to request access to the personal information
                we collect from you, change that information, or delete it in some circumstances. To request to review, update, or
                delete your personal information, please contact us at{' '}
                <a href="mailto:privacy_officer@evercarebd.com" className="text-blue-600 hover:underline">privacy_officer@evercarebd.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

