/**
 * \file   <%= generatorServiceName %>.h
 * \Author <%= generatorUserName %>, (<%= generatorUserEmail %>)
 * \date   <%=generatorDateGenerated %>
 * \brief  <%= generatorServiceDescription %>
 */

#ifndef <%= generatorHeaderGuard %>
#define <%= generatorHeaderGuard %>
 
#include <daf/TaskExecutor.h>
 
namespace <%= generatorNamespace %>
{
    <% if (generatorActiveService == 'active') {%> <%= generatorNumThreadsVar %> <% } %>

    /**
     * \brief <%= generatorServiceDescription %>
     */
    class <%= generatorServiceName %>_Export <%= generatorServiceName %> : public virtual DAF::TaskExecutor
    {
    public:
        /**
         * \brief Constructor.
         */
        <%= generatorServiceName %>(void);
 
        /**
         * \brief Ruturns the service identification.
         * \return the dervice identification.
         */
        static const char* svc_ident()
        {
            return ACE_TEXT("Lasagne_<%= generatorServiceName %>");
        }

        /**
         * \brief The main entry point of the service called by the LASAGNE framework.
         * \param argc - the number of arguments.
         * \param argv - an array of arguments.
         * \return zero if successful.
         */
        int init(int argc, ACE_TCHAR *argv[]) override;

        /**
         * \brief Returns information about this service.
         * \param info_string - service information is saved in this pointer.
         * \param length - length of the return string.
         * \return zero if successful.
         */

        int info(ACE_TCHAR **info_string, size_t length = 0) const  override;
 
        /**
         * \brief Called by the LASAGNE framework when the service is to wind up.
         * \return zero if successful.
         */
        int fini(void) override;

        <% if (generatorActiveService == 'active') {%>
        /**
          * \brief The svc method is the worker thread method for this service.
          * \return zero if successful.
          */
        int svc(void) override;
         <% } %>
    protected:

        /**
         * \brief Takes the given command line and parses the arguments given to this service.
         * \param argc - the number of arguments.
         * \param argv - an array of arguments.
         * \return zero if successful.
         */
        int parse_args(int argc, ACE_TCHAR *argv[]);
    };
}
 
typedef class <%= generatorNamespace %>::<%= generatorServiceName %> <%= generatorNamespaceUpper %>_<%= generatorServiceName %>;
ACE_FACTORY_DECLARE(<%= generatorServiceName %>, <%= generatorNamespaceUpper %>_<%= generatorServiceName %>);
 
#endif // <%= generatorHeaderGuard %>